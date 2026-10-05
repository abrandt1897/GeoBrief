// @ts-check
import { defineConfig, devices } from "@playwright/test";

// Set CHROMIUM_PATH to use a preinstalled browser instead of `npx playwright install`.
const executablePath = process.env["CHROMIUM_PATH"];

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env["CI"],
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    ...devices["Desktop Chrome"],
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
});
