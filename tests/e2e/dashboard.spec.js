// @ts-check
import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const PAGE = pathToFileURL(path.resolve("dashboard/dist/index.html")).href;

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
  await expect(page.locator("h1")).toHaveText(/Will the War Resume/);
  await expect(page.locator("#dateline")).toContainText("days to Election Day");
  await expect(page.locator("#scen-body tr")).toHaveCount(7);
  await expect(page.locator("#scen-body tr").first()).toContainText("39%");
  await expect(page.locator("#disp .disp")).toHaveCount(6);
  await expect(page.locator("#ticker")).toContainText("WAR BY NOV. 3");
  await expect(page.locator("#ticker")).toContainText("AAA NATIONAL");
  expect(errors).toEqual([]);
});

test("scenario tables follow the selected tab", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("#scenarios")).toBeVisible();
  await expect(page.locator("#ye-scenarios")).toBeHidden();
  await page.click("#tab-gas");
  await expect(page.locator("#scenarios")).toBeHidden();
  await expect(page.locator("#ye-scenarios")).toBeHidden();
  await page.click("#tab-yearend");
  await expect(page.locator("#scenarios")).toBeHidden();
  await expect(page.locator("#ye-scenarios")).toBeVisible();
  await expect(page.locator("#ye-body tr")).toHaveCount(5);
  await expect(page.locator("#panel svg")).toContainText("Dec. 31");
  await page.click("#seg-all");
  await expect(page.locator(".legend > span")).toHaveCount(5);
});

test("grouped odds chart labels sum to 100", async ({ page }) => {
  await page.goto(PAGE);
  // End-label values are the bold, centred texts inside the coloured pills.
  const labels = await page.locator('#panel svg text[font-weight="700"][text-anchor="middle"]').allTextContents();
  const pcts = labels.map((t) => parseInt(t));
  expect(pcts).toHaveLength(3);
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
  await expect(tip).toContainText("War");
  const first = await tip.locator("b").textContent();
  await svg.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tip.locator("b")).not.toHaveText(first ?? "");
  await page.keyboard.press("Escape");
  await expect(tip).toBeHidden();
});

test("all-seven toggle shows a legend for every scenario", async ({ page }) => {
  await page.goto(PAGE);
  await page.click("#seg-all");
  await expect(page.locator("#seg-all")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".legend > span")).toHaveCount(7);
  await page.click("#seg-grouped");
  await expect(page.locator(".legend")).toHaveCount(0);
});

/** @type {[string, string][]} */
const TABS = [
  ["odds", "The Odds Through Election Day"],
  ["gas", "Gas Prices Against The Scenarios"],
  ["supply", "How Much Oil Is Getting Out"],
  ["blinks", "The Blink Count"],
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

test("physical supply chart shows five series, the war start and the latest supply note", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(`${PAGE}#supply`);
  await expect(page.locator("#panel-title")).toHaveText("How Much Oil Is Getting Out");
  await expect(page.locator(".legend > span")).toHaveCount(5);
  await expect(page.locator("#panel svg")).toContainText("War begins");
  await expect(page.locator(".annos > div").first()).toBeVisible();
  await expect(page.locator(".supply-note h3")).not.toBeEmpty();
  await expect(page.locator(".supply-note details")).not.toHaveAttribute("open");
  await page.click(".supply-note summary");
  await expect(page.locator(".supply-note details li").first()).toBeVisible();
  const svg = page.locator("#panel svg");
  await svg.focus();
  await expect(page.locator(".tip")).toContainText("mb/d");
  expect(errors).toEqual([]);
});

test("gas chart: year to date by default, last 45 days shows end labels", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(`${PAGE}#gas`);
  await expect(page.locator("#seg-ytd")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#panel svg")).toContainText("JAN.");
  await expect(page.locator("#panel svg")).toContainText("War begins");
  await expect(page.locator(".legend > span")).toHaveCount(1);
  await expect(page.locator("#panel")).not.toContainText("NYC");
  await page.click("#seg-recent");
  await expect(page.locator("#seg-recent")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#panel svg")).not.toContainText("JAN.");
  await expect(page.locator('#panel svg text[font-weight="700"][text-anchor="middle"]').first()).toContainText("$");
  expect(errors).toEqual([]);
});

test("tab deep link via #hash", async ({ page }) => {
  await page.goto(`${PAGE}#tripwires`);
  await expect(page.locator("#panel-title")).toHaveText("What Would Move The Odds");
  await expect(page.locator(".trip")).toHaveCount(13);
  await expect(page.locator(".trip").first()).toContainText("FIRED");
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
  await expect(page.locator(".secnav")).toBeHidden();
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
