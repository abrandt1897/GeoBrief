// @ts-check
import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const PAGE = pathToFileURL(path.resolve("dashboard/dist/index.html")).href;

/** The built page's data payload. @returns {any} */
function payload() {
  const html = fs.readFileSync(path.resolve("dashboard/dist/index.html"), "utf8");
  const m = /<script id="geobrief-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  if (!m?.[1]) throw new Error("no data block");
  return JSON.parse(m[1]);
}
/** The built page's brief.updated (YYYY-MM-DD). @returns {string} */
const briefUpdated = () => String(payload().brief.updated).slice(0, 10);
/** Latest p of a forecast id. @param {string} id @returns {number} */
const latestP = (id) =>
  /** @type {{ id: string, made_on: string, p: number }[]} */ (payload().forecasts)
    .filter((f) => f.id === id)
    .sort((a, b) => (a.made_on < b.made_on ? -1 : 1))
    .at(-1)?.p ?? NaN;

/** @param {import("@playwright/test").Page} page @returns {string[]} */
function collectErrors(page) {
  /** @type {string[]} */
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // Google Fonts may be unreachable in CI sandboxes; that's not a page bug.
    if (m.type() === "error" && !/fonts\.g/.test(m.text()) && !/Failed to load resource/.test(m.text())) {
      errors.push(m.text());
    }
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  });
});

test("renders headline, scenario table, dispatches and ticker without errors", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(PAGE);
  await expect(page.locator("h1")).toHaveText(/Iran War Odds Through 2026/);
  await expect(page.locator("#dateline")).toContainText("days to Election Day");
  await expect(page.locator("#scen-body tr")).toHaveCount(4);
  await expect(page.locator("#scen-body tr").first()).toContainText("Limited war / Limbo");
  await expect(page.locator("#disp .disp")).toHaveCount(6);
  await expect(page.locator("#ticker")).toContainText("ESCALATED WAR BY NOV. 3");
  await expect(page.locator("#ticker")).toContainText(`WAR BY NOV. 3 ${latestP("war_nov3")}%`);
  await expect(page.locator("#ticker")).toContainText("AAA NATIONAL");
  expect(errors).toEqual([]);
});

test("scenario tables follow the selected tab", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("#scenarios")).toBeVisible();
  await expect(page.locator("#ye-scenarios")).toBeHidden();
  await expect(page.locator("#bet")).toBeVisible();
  await page.click("#tab-gas");
  await expect(page.locator("#bet")).toBeHidden();
  await expect(page.locator("#scenarios")).toBeHidden();
  await expect(page.locator("#ye-scenarios")).toBeHidden();
  await page.click("#tab-yearend");
  await expect(page.locator("#scenarios")).toBeHidden();
  await expect(page.locator("#ye-scenarios")).toBeVisible();
  await expect(page.locator("#ye-body tr")).toHaveCount(4);
  await expect(page.locator("#bet")).toBeVisible();
  await expect(page.locator("#panel svg")).toContainText("Dec. 31");
});

test("grouped odds chart labels sum to 100", async ({ page }) => {
  await page.goto(PAGE);
  // End-label values are the bold, centred texts inside the coloured pills.
  const labels = await page.locator('#panel svg text[font-weight="700"][text-anchor="middle"]').allTextContents();
  const pcts = labels.map((t) => parseInt(t));
  expect(pcts).toHaveLength(4);
  expect(pcts.reduce((a, b) => a + b, 0)).toBe(100);
});

test("hover shows a readout and arrow keys step through dates", async ({ page }) => {
  await page.goto(PAGE);
  const svg = page.locator("#panel svg");
  await svg.scrollIntoViewIfNeeded();
  const box = await svg.boundingBox();
  if (!box) throw new Error("chart not rendered");
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5);
  const tip = page.locator(".tip");
  await expect(tip).toBeVisible();
  await expect(tip).toContainText("Limited war");
  // The odds may hold a single date after a re-score, so step through the gas chart's many dates instead.
  await page.click("#tab-gas");
  const gas = page.locator("#panel svg");
  await gas.focus();
  await expect(tip).toBeVisible();
  const first = await tip.locator("b").textContent();
  await page.keyboard.press("ArrowLeft");
  await expect(tip.locator("b")).not.toHaveText(first ?? "");
  await page.keyboard.press("Escape");
  await expect(tip).toBeHidden();
});

/** @typedef {{ date: string, horizon: string, scenario: string, p: number }} OddsRow */
/** Sorted odds dates of one horizon. @param {string} horizon @returns {string[]} */
const oddsDates = (horizon) =>
  [
    ...new Set(/** @type {OddsRow[]} */ (payload().odds).filter((r) => r.horizon === horizon).map((r) => r.date)),
  ].sort();
/** Re-scores applying to a horizon. @param {string} horizon @returns {{ date: string, horizon: string, note: string }[]} */
const rescoresFor = (horizon) =>
  /** @type {{ date: string, horizon: string, note: string }[]} */ (payload().rescores ?? []).filter(
    (r) => r.horizon === horizon || r.horizon === "all",
  );

/** @type {[string, string][]} */
const SCENARIO_CHARTS = [
  ["odds", "nov3"],
  ["yearend", "ye2026"],
];
for (const [tab, horizon] of SCENARIO_CHARTS) {
  test(`${tab} chart: an unlabelled dashed line per re-score, with the note in the readout`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`${PAGE}#${tab}`);
    const dates = oddsDates(horizon);
    const last = dates.at(-1) ?? "";
    const dayOf = (/** @type {string} */ s) => Date.parse(`${s}T00:00:00Z`) / 864e5;
    const start = Math.min(dayOf(dates[0] ?? last), dayOf(last) - 35);
    const want = rescoresFor(horizon).filter((r) => dayOf(r.date) >= start && r.date <= last);
    const svg = page.locator("#panel svg");
    await expect(svg.locator("g.rescore")).toHaveCount(0);
    await expect(svg).not.toContainText("RE-SCORED");
    await expect(svg.locator("line.rescore-line")).toHaveCount(want.length);
    await expect(svg.locator("line.rescore-line").first()).toHaveAttribute("stroke-dasharray", /\d/);
    // The chart's readout for a re-scored date carries the note too (for touch and keyboard readers).
    const scored = want.find((r) => r.date === last);
    if (scored) {
      await svg.focus();
      await expect(page.locator(".tip .tip-note")).toContainText(scored.note);
    }
    expect(await svg.innerHTML()).not.toMatch(/NaN|Infinity/);
    expect(errors).toEqual([]);
  });
}

test("odds history: a dot per scenario even on a single date, and no ticker move across a re-score", async ({
  page,
}) => {
  await page.goto(PAGE);
  const dates = oddsDates("nov3");
  const last = dates.at(-1) ?? "";
  const prev = dates.at(-2);
  // End-label dots always mark the latest update, so even one date shows four points.
  await expect(page.locator("#panel svg circle[r='6']")).toHaveCount(4);
  const item = page.locator("#ticker > .item", { hasText: "ESCALATED WAR BY NOV. 3" });
  const crossed = !prev || rescoresFor("nov3").some((r) => r.date > prev && r.date <= last);
  if (crossed) await expect(item).not.toContainText(/[▲▼]|UNCH/);
});

test("odds chart shows one line per scenario and no toggle", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("#seg-all")).toHaveCount(0);
  await expect(page.locator("#seg-grouped")).toHaveCount(0);
});

/** @type {[string, string][]} */
const TABS = [
  ["odds", "The Odds Through Election Day"],
  ["gas", "Energy Prices Against The Scenarios"],
  ["supply", "How Much Oil Is Getting Out"],
  ["blinks", "The TACO Tracker"],
  ["tripwires", "What Would Move The Odds"],
  ["deal", "What A Deal Would Likely Contain"],
  ["yearend", "Where Things Stand By Dec. 31"],
  ["calibration", "How Good Are These Forecasts?"],
];

for (const [id, title] of TABS) {
  test(`tab "${id}" renders its panel`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(PAGE);
    await page.click(`#tab-${id}`);
    await expect(page.locator("#panel-title")).toHaveText(title);
    await expect(page.locator(`#tab-${id}`)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#panel")).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
}

test("physical supply chart defaults to Kpler, switches source, shows the war start and the latest supply note", async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto(`${PAGE}#supply`);
  await expect(page.locator("#panel-title")).toHaveText("How Much Oil Is Getting Out");
  await expect(page.locator(".legend > span")).toHaveCount(3);
  await expect(page.locator("#src-kpler")).toHaveAttribute("aria-pressed", "true");
  await page.click("#src-iea");
  await expect(page.locator("#src-iea")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".legend > span")).toHaveCount(3);
  await expect(page.locator("#panel svg")).toContainText("War begins");
  await expect(page.locator(".annos > div")).toHaveCount(0);
  await expect(page.locator("#panel-dek")).toBeHidden();
  await expect(page.locator(".supply-note h3")).not.toBeEmpty();
  await expect(page.locator(".supply-note details")).not.toHaveAttribute("open");
  await page.click(".supply-note summary");
  await expect(page.locator(".supply-note details li").first()).toBeVisible();
  const svg = page.locator("#panel svg");
  await svg.focus();
  await expect(page.locator(".tip")).toContainText("mb/d");
  await expect(page.locator(".tip .src")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("gas chart: Gas by default, Diesel button swaps the series, bands and odds", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(`${PAGE}#gas`);
  await expect(page.locator("#seg-gas")).toHaveAttribute("aria-pressed", "true");
  const gasSvg = page.locator("#panel svg");
  await expect(gasSvg).toContainText("JAN.");
  await expect(gasSvg).toContainText("War begins");
  await expect(page.locator(".legend")).toContainText("Regular");
  await expect(page.locator(".figs")).toContainText("$4.50–$4.75");
  await expect(page.locator("#panel")).not.toContainText("NYC");
  await page.click("#seg-diesel");
  await expect(page.locator("#seg-diesel")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".legend")).toContainText("Diesel");
  await expect(page.locator(".figs > div")).toHaveCount(5);
  await expect(page.locator(".figs")).toContainText("$7.00 or more");
  await expect(page.locator("#panel svg polyline").first()).not.toHaveAttribute("stroke-dasharray", /.*/);
  expect(errors).toEqual([]);
});

test("gas price ranges are exclusive and sum to 100% for every fuel", async ({ page }) => {
  await page.goto(`${PAGE}#gas`);
  for (const fuel of ["#seg-gas", "#seg-diesel", "#seg-brent", "#seg-lng"]) {
    await page.click(fuel);
    await expect(page.locator(fuel)).toHaveAttribute("aria-pressed", "true");
    const ps = await page.locator(".figs strong").allTextContents();
    expect(ps).toHaveLength(5);
    expect(ps.reduce((a, t) => a + Number(t.replace("%", "")), 0)).toBe(100);
  }
});

test("Brent and LNG buttons swap in their series, bands and ranges", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(`${PAGE}#gas`);
  await page.click("#seg-brent");
  const svg = page.locator("#panel svg");
  await expect(svg).toContainText("JAN.");
  await expect(svg).toContainText("War begins");
  await expect(page.locator(".legend")).toContainText("Brent futures");
  await expect(page.locator(".legend")).toContainText("Brent spot (EIA)");
  await expect(page.locator(".legend")).toContainText("January contract");
  await expect(svg.locator("rect title")).toHaveCount(4);
  await expect(page.locator(".figs")).toContainText("$120 or more");
  await page.click("#seg-lng");
  await expect(page.locator(".legend")).toContainText("JKM");
  await expect(page.locator(".legend")).toContainText("December contract");
  await expect(svg.locator("rect title")).toHaveCount(4);
  await expect(page.locator(".figs")).toContainText("Under $20");
  expect(errors).toEqual([]);
});

test("tab deep link via #hash", async ({ page }) => {
  await page.goto(`${PAGE}#tripwires`);
  await expect(page.locator("#panel-title")).toHaveText("What Would Move The Odds");
  await expect(page.locator(".trip")).toHaveCount(payload().tripwires.length);
  await expect(page.locator(".trip").first()).toContainText("FIRED");
});

test("expired and week-old fired tripwires sit in a collapsed past section", async ({ page }) => {
  await page.goto(`${PAGE}#tripwires`);
  const { tripwires, brief } = payload();
  const dayOf = (/** @type {string} */ s) => Date.parse(`${s.slice(0, 10)}T00:00:00Z`) / 864e5;
  const pastCount = /** @type {{ status: string, fired_on: string }[]} */ (tripwires).filter(
    (t) => t.status === "expired" || (t.status === "fired" && dayOf(brief.updated) - dayOf(t.fired_on) > 7),
  ).length;
  const past = page.locator("details.past-trips");
  await expect(past).not.toHaveAttribute("open", "");
  await expect(past.locator(".trip")).toHaveCount(pastCount);
  await expect(past.locator(".trip").first()).toBeHidden();
  await past.locator("summary").click();
  await expect(past.locator(".trip").first()).toBeVisible();
  await expect(page.locator(".cols").first().locator(".trip", { hasText: "EXPIRED" })).toHaveCount(0);
});

test("menu opens, switches tab, and closes on Escape and outside click", async ({ page }) => {
  await page.goto(PAGE);
  const btn = page.locator("#menu-btn");
  const drawer = page.locator("#drawer");
  await expect(drawer).toBeHidden();
  await btn.click();
  await expect(drawer).toBeVisible();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await page.click('#drawer a[data-tab="deal"]');
  await expect(drawer).toBeHidden();
  await expect(page.locator("#panel-title")).toHaveText("What A Deal Would Likely Contain");
  await btn.click();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await btn.click();
  await page.locator("#dispatches").click();
  await expect(drawer).toBeHidden();
});

test("phone width: no horizontal scroll, blink captions shrink", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${PAGE}#blinks`);
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollW).toBeLessThanOrEqual(390);
  const size = await page
    .locator(".timeline .cap")
    .first()
    .evaluate((el) => getComputedStyle(el).fontSize);
  expect(parseFloat(size)).toBeLessThanOrEqual(9);
  await expect(page.locator(".timeline .cap").first()).toHaveText("Ultimatum");
});

test("TACO tab and menu entry carry the Trump Always Chickens Out subtext", async ({ page }) => {
  await page.goto(`${PAGE}#blinks`);
  await expect(page.locator("#panel-sub")).toHaveText("Trump Always Chickens Out Tracker");
  await page.click("#menu-btn");
  await expect(page.locator('#drawer a[data-tab="blinks"] small')).toHaveText("Trump Always Chickens Out Tracker");
  await page.keyboard.press("Escape");
  await page.click("#tab-gas");
  await expect(page.locator("#panel-sub")).toBeHidden();
});

test("blink tab: short captions on the chart and a full list below it", async ({ page }) => {
  await page.goto(`${PAGE}#blinks`);
  const caps = await page.locator(".timeline .cap").allTextContents();
  expect(caps.length).toBeGreaterThanOrEqual(10);
  for (const c of caps) {
    expect(c.trim().split(/\s+/).length).toBeLessThanOrEqual(3);
    expect(c).not.toMatch(/\d{1,2}$/);
  }
  const items = page.locator(".blist li");
  await expect(items).toHaveCount(caps.length);
  await expect(items.first()).toContainText("April 7");
  await expect(page.locator(".blist .tag").getByText("CARRIED OUT", { exact: true })).toHaveCount(1);
  await expect(items.last()).toContainText("PENDING");
  await expect(page.locator("#panel .stack")).toHaveCount(0);
});

test("dispatches load older events in pages back to the start of the war", async ({ page }) => {
  await page.goto(PAGE);
  const rows = page.locator("#disp .disp");
  const more = page.locator("#disp-more");
  await expect(rows).toHaveCount(6);
  await expect(more).toBeVisible();
  let prev = 6;
  while (await more.isVisible()) {
    await more.click();
    const n = await rows.count();
    expect(n - prev).toBeGreaterThanOrEqual(1);
    expect(n - prev).toBeLessThanOrEqual(8);
    prev = n;
  }
  await expect(rows.last()).toContainText("Feb. 28");
  await expect(rows.last()).toContainText("Khamenei");
});

test("clicking the ticker pauses it and clicking again resumes it", async ({ page }) => {
  await page.goto(PAGE);
  const btn = page.locator("#ticker-toggle");
  const state = () => page.locator("#ticker").evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(await state()).toBe("running");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  expect(await state()).toBe("paused");
  await page.mouse.move(0, 0);
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "false");
  expect(await state()).toBe("running");
});

test("right-clicking the ticker disables it; footer button restores it and the choice persists", async ({ page }) => {
  await page.goto(PAGE);
  const ticker = page.locator(".ticker");
  await page.locator("#ticker-toggle").click({ button: "right" });
  await page.click("#ticker-off");
  await expect(ticker).toBeHidden();
  await expect(page.locator("#ticker-on")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("gb-ticker"))).toBe("off");
  await page.click("#ticker-on");
  await expect(ticker).toBeVisible();
  await expect(page.locator("#ticker-on")).toBeHidden();
});

test("phone: tab bar and menu fit the screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGE);
  const tabs = await page.locator("#tabs").evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }));
  expect(tabs.sw).toBeLessThanOrEqual(tabs.cw);
  for (const box of await page
    .locator("#tabs button")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()))) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(390);
  }
  await page.click("#menu-btn");
  const lefts = await page.locator("#drawer a").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().left));
  for (const l of lefts) expect(l).toBeGreaterThanOrEqual(16);
});

test("dark mode uses the dark palette", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(PAGE);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(18, 18, 18)");
});

test("a tab picked from the menu survives a reload via the URL hash", async ({ page }) => {
  await page.goto(PAGE);
  await page.click("#menu-btn");
  await expect(page.locator('#drawer a[data-tab="supply"]')).toHaveAttribute("href", "#supply");
  await page.click('#drawer a[data-tab="supply"]');
  await expect(page.locator("#panel-title")).toHaveText("How Much Oil Is Getting Out");
  expect(new URL(page.url()).hash).toBe("#supply");
  await page.click("#tab-deal");
  expect(new URL(page.url()).hash).toBe("#deal");
  // Clear storage so only the hash can carry the tab across the reload.
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#panel-title")).toHaveText("What A Deal Would Likely Contain");
  await expect(page.locator("#tab-deal")).toHaveAttribute("aria-selected", "true");
});

test("fresh data: no staleness notice and the ticker says LIVE", async ({ page }) => {
  // Noon ET on the update day.
  await page.clock.setFixedTime(new Date(`${briefUpdated()}T16:00:00Z`));
  await page.goto(PAGE);
  await expect(page.locator("#stale-note")).toHaveCount(0);
  await expect(page.locator(".ticker .live")).toHaveText("LIVE");
});

test("stale data: notice under the dateline, ticker not LIVE, fits a phone in dark mode", async ({ page }) => {
  const updated = briefUpdated();
  const later = new Date(`${updated}T22:00:00Z`);
  later.setUTCDate(later.getUTCDate() + 2);
  await page.clock.setFixedTime(later);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = collectErrors(page);
  await page.goto(PAGE);
  const note = page.locator("#stale-note");
  await expect(note).toBeVisible();
  await expect(note).toContainText("Last updated");
  await expect(note).toContainText("may have been missed");
  await expect(page.locator(".ticker .live")).not.toHaveText("LIVE");
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollW).toBeLessThanOrEqual(390);
  const box = await note.boundingBox();
  if (!box) throw new Error("notice not rendered");
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});
