// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('機能ボタン', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('クリアボタンで初期化されること', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: 'C', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('0');
  });

  test('バックスペースで1文字削除できること', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '⌫', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('12');
  });

  test('1桁の状態でバックスペースを押すと0になること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '⌫', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('0');
  });
});
