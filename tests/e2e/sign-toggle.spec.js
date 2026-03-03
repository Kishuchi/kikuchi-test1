// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('負の数', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('符号を切り替えられること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '±', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('-5');
  });

  test('負の数から正の数に戻せること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '±', exact: true }).click();
    await page.getByRole('button', { name: '±', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('5');
  });

  test('負の数の計算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '±', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('-2');
  });
});
