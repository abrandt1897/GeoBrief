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
  ["odds", "The odds through Election Day"],
  ["gas", "Gas prices against the scenarios"],
  ["blinks", "The blink count"],
  ["tripwires", "What would move the odds"],
  ["deal", "What a deal would likely contain"],
  ["yearend", "Where things stand by Dec. 31"],
  ["calibration", "How good are these forecasts?"],
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

test("tab deep link via #hash", async ({ page }) => {
  await page.goto(`${PAGE}#tripwires`);
  await expect(page.locator("#panel-title")).toHaveText("What would move the odds");
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
  await expect(page.locator("#panel-title")).toHaveText("What a deal would likely contain");
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
  await expect(page.locator(".timeline .cap span").first()).toBeHidden();
});

test("dark mode uses the dark palette", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(PAGE);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(18, 18, 18)");
});
