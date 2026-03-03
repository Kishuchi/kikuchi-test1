// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('エラー処理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ゼロ除算で"ZERO DIV"が表示されること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('ZERO DIV');
  });

  test('エラー後にクリアで復帰できること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await page.getByRole('button', { name: 'C', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('0');
  });

  test('エラー後に数字入力で新しい計算を開始できること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await page.getByRole('button', { name: '7', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('7');
  });
});
