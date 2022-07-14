import { test, expect } from "@playwright/test";

test("Initial title", async ({ page }) => {
  await page.goto("https://localhost:80/");
  const title = page.locator("title");
  
  expect(await title.innerText()).toBe("Vuk | An EPUB reader for the web");
});