// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('基本表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('初期表示が0であること', async ({ page }) => {
    const display = page.locator('#display');
    await expect(display).toHaveText('0');
  });

  test('電卓のUIが表示されること', async ({ page }) => {
    await expect(page.locator('.calculator')).toBeVisible();
    await expect(page.locator('.display')).toBeVisible();
    await expect(page.locator('.buttons')).toBeVisible();
  });
});
