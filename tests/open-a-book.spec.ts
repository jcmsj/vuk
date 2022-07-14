import { test, expect } from '@playwright/test';
import delay from "./delay"

test("open-a-book", async ({ page }) => {
  await page.goto('https://localhost:80/');

  const title = page.locator("title")

  // Click text=📂 >> nth=0
  await page.locator('text=📂').first().click();

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('text=Open 📖').click()
  ]);
  await fileChooser.setFiles("./tests/Hello Dreamworld.epub");
  await delay(2000) // Since the book is simple, 2s is enough to simulate loading.
  expect(await title.innerText()).toBe("Hello Dreamworld")
});