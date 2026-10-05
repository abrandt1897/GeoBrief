// @ts-check
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "dashboard/dist/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  {
    files: ["dashboard/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: globals.browser },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-implicit-globals": "error",
    },
  },
  {
    files: ["eslint.config.js", "playwright.config.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: globals.node },
  },
  {
    // Playwright specs run in Node, but page.evaluate callbacks run in the browser.
    files: ["tests/e2e/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { ...globals.node, ...globals.browser } },
  },
];
