const ALLOCATOR_STORAGE_KEY = "study_condition_allocator_v1";
const ALLOCATOR_STATE_VERSION = 1;
const SHARED_ALLOCATOR_API_URL = (import.meta.env.VITE_ALLOCATOR_API_URL || "").trim();

// This pool mirrors the current wave-2 shortfall by condition.
// Important: state is stored in browser-local localStorage only.
export const DEFAULT_WAVE_TWO_REMAINING = Object.freeze({
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

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneObject(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCond(rawCond) {
  return String(rawCond || "").trim();
}

function normalizeRemainingCounts(validConds, counts = {}) {
  return validConds.reduce((acc, cond) => {
    const rawValue = counts[cond];
    const nextValue = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 0;
    acc[cond] = Math.max(0, Math.floor(nextValue));
    return acc;
  }, {});
}

function buildDefaultState(validConds) {
  return {
    version: ALLOCATOR_STATE_VERSION,
    scope: "browser_local",
    remainingByCond: normalizeRemainingCounts(validConds, DEFAULT_WAVE_TWO_REMAINING),
    assignments: {},
    updatedAt: new Date().toISOString(),
  };
}

function isValidAllocatorState(state, validConds) {
  if (!state || typeof state !== "object") return false;
  if (state.version !== ALLOCATOR_STATE_VERSION) return false;
  if (!state.remainingByCond || typeof state.remainingByCond !== "object") return false;
  if (!state.assignments || typeof state.assignments !== "object") return false;

  return validConds.every((cond) => Object.hasOwn(state.remainingByCond, cond));
}

function persistAllocatorState(state) {
  if (!isBrowser()) return state;
  window.localStorage.setItem(ALLOCATOR_STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function getAllocatorState(conditions) {
  const validConds = conditions.map((entry) => normalizeCond(entry.cond));
  const fallback = buildDefaultState(validConds);

  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(ALLOCATOR_STORAGE_KEY);
    if (!raw) {
      return persistAllocatorState(fallback);
    }

    const parsed = JSON.parse(raw);
    if (!isValidAllocatorState(parsed, validConds)) {
      return persistAllocatorState(fallback);
    }

    return {
      ...parsed,
      remainingByCond: normalizeRemainingCounts(validConds, parsed.remainingByCond),
    };
  } catch {
    return persistAllocatorState(fallback);
  }
}

export function resetAllocatorState(conditions) {
  const nextState = buildDefaultState(conditions.map((entry) => normalizeCond(entry.cond)));
  return persistAllocatorState(nextState);
}

export function replaceAllocatorState(conditions, overrides = {}) {
  const validConds = conditions.map((entry) => normalizeCond(entry.cond));
  const nextState = {
    version: ALLOCATOR_STATE_VERSION,
    scope: "browser_local",
    remainingByCond: normalizeRemainingCounts(
      validConds,
      overrides.remainingByCond || DEFAULT_WAVE_TWO_REMAINING
    ),
    assignments: {},
    updatedAt: new Date().toISOString(),
  };
  return persistAllocatorState(nextState);
}

export function hashStringToInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function assignConditionByPid(pid, conditions) {
  const idx = hashStringToInt(pid || "no_pid") % conditions.length;
  return conditions[idx];
}

function buildExpandedPool(remainingByCond) {
  return Object.entries(remainingByCond)
    .sort(([left], [right]) => Number(left) - Number(right))
    .flatMap(([cond, remaining]) => Array.from({ length: remaining }, () => cond));
}

export function allocateQuotaCondition(pid, conditions) {
  const state = getAllocatorState(conditions);
  const normalizedPid = String(pid || "no_pid");
  const existingCond = normalizeCond(state.assignments[normalizedPid]);

  if (existingCond) {
    const existingCondition = conditions.find((entry) => entry.cond === existingCond) || null;
    return {
      condition: existingCondition,
      state,
      source: "quota_existing_assignment",
      exhausted: false,
    };
  }

  const pool = buildExpandedPool(state.remainingByCond);
  if (!pool.length) {
    return {
      condition: null,
      state,
      source: "quota_exhausted",
      exhausted: true,
    };
  }

  const selectedCond = pool[hashStringToInt(normalizedPid) % pool.length];
  const nextState = cloneObject(state);
  nextState.assignments[normalizedPid] = selectedCond;
  nextState.remainingByCond[selectedCond] = Math.max(
    0,
    Number(nextState.remainingByCond[selectedCond] || 0) - 1
  );
  nextState.updatedAt = new Date().toISOString();
  persistAllocatorState(nextState);

  return {
    condition: conditions.find((entry) => entry.cond === selectedCond) || null,
    state: nextState,
    source: "quota_new_assignment",
    exhausted: false,
  };
}

export function resolveConditionAllocation({ pid, conditions, mode = "hash" }) {
  if (mode === "quota") {
    const allocation = allocateQuotaCondition(pid, conditions);
    if (allocation.condition) {
      return {
        ...allocation,
        mode: "quota",
      };
    }

    return {
      condition: assignConditionByPid(pid, conditions),
      state: allocation.state,
      source: "quota_exhausted_fallback_hash",
      exhausted: true,
      mode: "quota",
    };
  }

  return {
    condition: assignConditionByPid(pid, conditions),
    state: getAllocatorState(conditions),
    source: "pid_hash",
    exhausted: false,
    mode: "hash",
  };
}

export function installAllocatorDebugApi(conditions) {
  if (!isBrowser()) return;

  window.__studyAllocator = {
    getState: () => getAllocatorState(conditions),
    reset: () => resetAllocatorState(conditions),
    replaceRemainingByCond: (remainingByCond) =>
      replaceAllocatorState(conditions, { remainingByCond }),
    defaultRemainingByCond: cloneObject(DEFAULT_WAVE_TWO_REMAINING),
    sharedApiUrl: SHARED_ALLOCATOR_API_URL,
  };
}

export function getSharedAllocatorApiUrl() {
  return SHARED_ALLOCATOR_API_URL;
}

export async function allocateSharedCondition(pid, conditions) {
  if (!SHARED_ALLOCATOR_API_URL) {
    throw new Error("Shared allocator API URL is not configured");
  }

  const response = await fetch(`${SHARED_ALLOCATOR_API_URL}/api/allocator/allocate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pid }),
  });

  if (!response.ok) {
    throw new Error(`Shared allocator request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const condition =
    conditions.find((entry) => entry.cond === String(payload.condition || "").trim()) || null;

  return {
    condition,
    state: payload.state || null,
    source: payload.source || "shared_allocator",
    exhausted: Boolean(payload.exhausted),
    mode: "quota",
    backend: "shared_api",
  };
}
