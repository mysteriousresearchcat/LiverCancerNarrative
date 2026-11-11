#!/usr/bin/env node
/**
 * Scrolls through the story at a constant, smooth speed so it can be
 * screen-recorded (e.g. with OBS). This script does not record video itself;
 * it only drives the browser.
 *
 * Usage (from the Leberstory folder):
 *   npm run record -- [options]
 *
 * Options:
 *   --url <url>       Site to open (default: http://localhost:5173/)
 *   --cond <list>     Condition(s) 1-9: "1", "1,4,7" or "all" (default: 1)
 *   --speed <px/s>    Scroll speed in pixels per second (default: 220)
 *   --delay <s>       Countdown before scrolling starts, to start the
 *                     recorder and let the hero animation finish (default: 6)
 *   --hold <s>        Seconds to stay on the final screen (default: 4)
 *   --width <px>      Window width when not fullscreen (default: 1920)
 *   --height <px>     Window height when not fullscreen (default: 1080)
 *   --windowed        Use a normal window instead of fullscreen
 *   --browser <name>  "chrome" or "msedge" (default: chrome, falls back to msedge)
 *   --headless        Run without a visible window (for testing only)
 */
import { chromium } from "playwright-core";

const DEFAULTS = {
  url: "http://localhost:5173/",
  cond: "1",
  speed: 220,
  delay: 6,
  hold: 4,
  width: 1920,
  height: 1080,
  windowed: false,
  browser: "chrome",
  headless: false,
};

function parseArgs(argv) {
  const opts = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "windowed" || key === "headless") {
      opts[key] = true;
      continue;
    }
    if (key === "help") {
      opts.help = true;
      continue;
    }
    if (!(key in DEFAULTS)) throw new Error(`Unknown option: ${arg}`);
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    opts[key] = typeof DEFAULTS[key] === "number" ? Number(value) : value;
  }
  return opts;
}

function parseConditions(raw) {
  const list =
    String(raw).trim().toLowerCase() === "all"
      ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
      : String(raw).split(",").map((c) => c.trim()).filter(Boolean);
  for (const c of list) {
    if (!/^[1-9]$/.test(c)) throw new Error(`Invalid condition "${c}" (expected 1-9 or "all")`);
  }
  return list;
}

function buildUrl(base, cond) {
  const url = new URL(base);
  url.searchParams.set("cond", cond);
  return url.toString();
}

async function launchBrowser(opts) {
  const fullscreen = !opts.windowed && !opts.headless;
  const launchOptions = {
    headless: opts.headless,
    // Hides the "Chrome is being controlled by automated test software" bar.
    ignoreDefaultArgs: ["--enable-automation"],
    args: fullscreen
      ? ["--start-fullscreen"]
      : [`--window-size=${opts.width},${opts.height}`],
  };
  const channels = opts.browser === "msedge" ? ["msedge"] : [opts.browser, "msedge"];
  let lastError;
  for (const channel of channels) {
    try {
      const browser = await chromium.launch({ ...launchOptions, channel });
      return { browser, channel, fullscreen };
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Could not start Chrome or Edge: ${lastError?.message}`);
}

async function countdown(seconds, label) {
  for (let s = Math.ceil(seconds); s > 0; s--) {
    process.stdout.write(`\r${label}: scrolling starts in ${s}s `);
    await new Promise((r) => setTimeout(r, 1000));
  }
  process.stdout.write(`\r${label}: scrolling...                    \n`);
}

/** Scrolls the page to the bottom at a constant speed, one step per frame. */
function scrollToEnd(page, speed) {
  return page.evaluate(
    (pxPerSecond) =>
      new Promise((resolve) => {
        let y = window.scrollY;
        let last = performance.now();
        const step = (now) => {
          const dt = Math.min((now - last) / 1000, 0.1);
          last = now;
          y += pxPerSecond * dt;
          // "instant" bypasses the site's CSS scroll-behavior: smooth.
          window.scrollTo({ top: y, behavior: "instant" });
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (y >= max - 1) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    speed
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log("See the comment at the top of scripts/record-walkthrough.mjs for options.");
    return;
  }
  const conditions = parseConditions(opts.cond);
  const { browser, channel, fullscreen } = await launchBrowser(opts);
  console.log(`Browser: ${channel}${fullscreen ? " (fullscreen)" : ""}`);

  try {
    const context = await browser.newContext({
      viewport: fullscreen ? null : { width: opts.width, height: opts.height },
    });
    const page = await context.newPage();

    for (const cond of conditions) {
      const url = buildUrl(opts.url, cond);
      console.log(`\nCondition ${cond}: ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts?.ready);
      await page.mouse.move(0, 0);

      await countdown(opts.delay, `Condition ${cond}`);
      const started = Date.now();
      await scrollToEnd(page, opts.speed);
      await page.waitForTimeout(opts.hold * 1000);
      console.log(`Condition ${cond}: done (${Math.round((Date.now() - started) / 1000)}s)`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
