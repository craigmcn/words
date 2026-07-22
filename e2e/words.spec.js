import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
});

test("rolls a fresh set of 32 letters on load", async ({ page }) => {
  const letters = page.locator(".letters__item");
  await expect(letters).toHaveCount(32);
  for (const letter of await letters.all()) {
    await expect(letter).toHaveAttribute("data-value", /^.$/);
  }
});

test("adds rows and columns to the grid", async ({ page }) => {
  const rows = page.locator("#words__grid tbody tr");
  const firstRowCells = () => rows.first().locator(".words__cell");

  await expect(rows).toHaveCount(10);
  await expect(firstRowCells()).toHaveCount(10);

  await page.getByRole("button", { name: "Add top row" }).click();
  await expect(rows).toHaveCount(11);

  await page.getByRole("button", { name: "Add bottom row" }).click();
  await expect(rows).toHaveCount(12);

  await page.getByRole("button", { name: "Add left column" }).click();
  await expect(firstRowCells()).toHaveCount(11);

  await page.getByRole("button", { name: "Add right column" }).click();
  await expect(firstRowCells()).toHaveCount(12);
});

test("drags a letter onto the grid and back off again", async ({ page }) => {
  const letter = page.locator(".letters__item").first();
  const cell = page.locator(".words__cell").first();
  const value = await letter.getAttribute("data-value");

  await letter.dragTo(cell);
  await expect(cell).toHaveText(value);
  await expect(letter).toHaveClass(/used/);

  await cell.dragTo(letter);
  await expect(cell).toBeEmpty();
  await expect(letter).not.toHaveClass(/used/);
});

test("toggles header, footer, and button text visibility", async ({ page }) => {
  const header = page.locator("#header");
  const footer = page.locator("#footer");
  const rollLabel = page.locator("#roll .js-canHide");

  await page.getByRole("button", { name: "Toggle header, footer" }).click();
  await expect(header).toHaveClass(/visually-hidden/);
  await expect(footer).toHaveClass(/visually-hidden/);

  await page.getByRole("button", { name: "Toggle button text" }).click();
  await expect(rollLabel).toHaveClass(/visually-hidden/);
});
