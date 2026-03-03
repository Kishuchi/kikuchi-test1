// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('桁数制限', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('9桁まで入力できること', async ({ page }) => {
    for (let i = 0; i < 9; i++) {
      await page.getByRole('button', { name: '1', exact: true }).click();
    }
    await expect(page.locator('#display')).toHaveText('111111111');
  });

  test('9桁を超えて入力できないこと', async ({ page }) => {
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: '1', exact: true }).click();
    }
    await expect(page.locator('#display')).toHaveText('111111111');
  });
});
