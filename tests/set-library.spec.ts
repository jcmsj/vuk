import { test, expect } from '@playwright/test';

test("set-library", async ({ page }) => {

  // Go to site
  await page.goto('https://localhost:80/');

  // Click text=📂 >> nth=0
  await page.locator('text=📂').first().click();

  // Click text=Set 📂
  await page.locator('text=Set 📂').click();

});