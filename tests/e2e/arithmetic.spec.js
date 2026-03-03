// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('四則演算', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('加算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('8');
  });

  test('減算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '9', exact: true }).click();
    await page.getByRole('button', { name: '−', exact: true }).click();
    await page.getByRole('button', { name: '4', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('5');
  });

  test('乗算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '6', exact: true }).click();
    await page.getByRole('button', { name: '×', exact: true }).click();
    await page.getByRole('button', { name: '7', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('42');
  });

  test('除算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '8', exact: true }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('4');
  });

  test('小数の計算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '.', exact: true }).click();
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '.', exact: true }).click();
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('4');
  });

  test('連続計算ができること', async ({ page }) => {
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('5');
    await page.getByRole('button', { name: '4', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('9');
  });
});
