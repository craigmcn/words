// Runs axe-core directly against jsdom (no browser) using the real
// index.html markup, so violations are caught without a Playwright run.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

const indexHtml = readFileSync(
  resolve(process.cwd(), "src/index.html"),
  "utf-8",
);
const bodyMatch = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/);
if (!bodyMatch) {
  throw new Error("Could not find a <body> element in src/index.html");
}
const bodyMarkup = bodyMatch[1];

// jsdom doesn't perform layout/rendering, so rules that depend on it
// (color contrast, actual visibility) can't be evaluated meaningfully.
const axeOptions = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

describe("accessibility", () => {
  it("has no axe violations on the initial game board", async () => {
    vi.resetModules();
    document.body.innerHTML = bodyMarkup;
    await import("../src/scripts/index.js");

    const results = await axe.run(document.body, axeOptions);
    expect(results.violations).toEqual([]);
  });
});
