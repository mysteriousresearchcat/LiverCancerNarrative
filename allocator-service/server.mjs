import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_REMAINING_BY_COND = Object.freeze({
  "1": 2,
  "2": 6,
  "3": 5,
  "4": 8,
  "5": 15,
  "6": 12,
  "7": 14,
  "8": 0,
  "9": 6,
});

const VALID_CONDS = Object.keys(DEFAULT_REMAINING_BY_COND);
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_FILE =
  process.env.ALLOCATOR_DATA_FILE ||
  path.join(__dirname, "data", "allocator-state.json");
const ADMIN_TOKEN = process.env.ALLOCATOR_ADMIN_TOKEN || "";
const ALLOWED_ORIGINS = (process.env.ALLOCATOR_ALLOWED_ORIGINS || "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

function hashStringToInt(value) {
  let hashed = 0;
  for (const character of value) {
    hashed = (hashed * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hashed;
}

function normalizeRemainingByCond(remainingByCond = {}) {
  return VALID_CONDS.reduce((acc, cond) => {
    const rawValue = Number(remainingByCond[cond]);
    acc[cond] = Number.isFinite(rawValue) ? Math.max(0, Math.floor(rawValue)) : 0;
    return acc;
  }, {});
}

function buildDefaultState() {
  return {
    version: 1,
    scope: "shared_file_store",
    remainingByCond: normalizeRemainingByCond(DEFAULT_REMAINING_BY_COND),
    assignments: {},
    updatedAt: new Date().toISOString(),
  };
}

function ensureStateDir() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function readState() {
  ensureStateDir();
  if (!fs.existsSync(DATA_FILE)) {
    const initialState = buildDefaultState();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...buildDefaultState(),
      ...parsed,
      remainingByCond: normalizeRemainingByCond(parsed.remainingByCond),
      assignments:
        parsed.assignments && typeof parsed.assignments === "object"
          ? parsed.assignments
          : {},
    };
  } catch {
    const fallbackState = buildDefaultState();
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackState, null, 2));
    return fallbackState;
  }
}

function writeState(state) {
  ensureStateDir();
  const nextState = {
    ...state,
    remainingByCond: normalizeRemainingByCond(state.remainingByCond),
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(nextState, null, 2));
  return nextState;
}

function buildExpandedPool(remainingByCond) {
  return Object.entries(remainingByCond)
    .sort(([left], [right]) => Number(left) - Number(right))
    .flatMap(([cond, remaining]) => Array.from({ length: remaining }, () => cond));
}

function allocateCondition(pid) {
  const normalizedPid = String(pid || "no_pid").trim() || "no_pid";
  const state = readState();
  const existingCond = state.assignments[normalizedPid];

  if (existingCond && VALID_CONDS.includes(existingCond)) {
    return {
      condition: existingCond,
      source: "shared_existing_assignment",
      exhausted: false,
      state,
    };
  }

  const pool = buildExpandedPool(state.remainingByCond);
  if (!pool.length) {
    return {
      condition: null,
      source: "shared_quota_exhausted",
      exhausted: true,
      state,
    };
  }

  const selectedCond = pool[hashStringToInt(normalizedPid) % pool.length];
  const nextState = {
    ...state,
    assignments: {
      ...state.assignments,
      [normalizedPid]: selectedCond,
    },
    remainingByCond: {
      ...state.remainingByCond,
      [selectedCond]: Math.max(0, state.remainingByCond[selectedCond] - 1),
    },
  };

  return {
    condition: selectedCond,
    source: "shared_new_assignment",
    exhausted: false,
    state: writeState(nextState),
  };
}

function summarizeState(state) {
  return {
    version: state.version,
    scope: state.scope,
    remainingByCond: state.remainingByCond,
    assignedCount: Object.keys(state.assignments).length,
    updatedAt: state.updatedAt,
  };
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function getCorsHeaders(origin) {
  const allowAll = ALLOWED_ORIGINS.includes("*");
  const allowedOrigin = allowAll
    ? "*"
    : ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0] || "null";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Allocator-Admin-Token",
  };
}

function sendJson(res, statusCode, payload, origin = "") {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...getCorsHeaders(origin),
  });
  res.end(JSON.stringify(payload));
}

function isAuthorized(req) {
  if (!ADMIN_TOKEN) return false;

  const authHeader = req.headers.authorization || "";
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) return true;
  if (req.headers["x-allocator-admin-token"] === ADMIN_TOKEN) return true;
  return false;
}

function notFound(res, origin) {
  sendJson(res, 404, { error: "Not found" }, origin);
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, getCorsHeaders(origin));
    res.end();
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/health") {
    sendJson(
      res,
      200,
      {
        ok: true,
        service: "study-condition-allocator",
      },
      origin
    );
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/allocator/state") {
    sendJson(res, 200, summarizeState(readState()), origin);
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/allocator/allocate") {
    try {
      const body = await parseJsonBody(req);
      const pid = String(body.pid || "").trim();

      if (!pid) {
        sendJson(res, 400, { error: "Missing pid" }, origin);
        return;
      }

      const allocation = allocateCondition(pid);
      sendJson(
        res,
        200,
        {
          ok: !allocation.exhausted,
          condition: allocation.condition,
          source: allocation.source,
          exhausted: allocation.exhausted,
          state: summarizeState(allocation.state),
        },
        origin
      );
    } catch (error) {
      sendJson(res, 400, { error: error.message }, origin);
    }
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/allocator/reset") {
    if (!isAuthorized(req)) {
      sendJson(res, 401, { error: "Unauthorized" }, origin);
      return;
    }

    const nextState = writeState(buildDefaultState());
    sendJson(res, 200, { ok: true, state: summarizeState(nextState) }, origin);
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/allocator/replace") {
    if (!isAuthorized(req)) {
      sendJson(res, 401, { error: "Unauthorized" }, origin);
      return;
    }

    try {
      const body = await parseJsonBody(req);
      const nextState = writeState({
        ...buildDefaultState(),
        remainingByCond: normalizeRemainingByCond(body.remainingByCond),
        assignments: {},
      });
      sendJson(res, 200, { ok: true, state: summarizeState(nextState) }, origin);
    } catch (error) {
      sendJson(res, 400, { error: error.message }, origin);
    }
    return;
  }

  notFound(res, origin);
});

server.listen(PORT, HOST, () => {
  console.log(
    `Allocator service listening on http://${HOST}:${PORT} using data file ${DATA_FILE}`
  );
});
