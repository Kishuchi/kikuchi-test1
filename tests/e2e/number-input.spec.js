// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('数字入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('数字ボタンで入力できること', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('123');
  });

  test('0から始まる場合、先頭の0は表示されないこと', async ({ page }) => {
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '5', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('5');
  });

  test('小数点を入力できること', async ({ page }) => {
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '.', exact: true }).click();
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '4', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('3.14');
  });

  test('小数点は1つまでしか入力できないこと', async ({ page }) => {
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '.', exact: true }).click();
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '.', exact: true }).click();
    await page.getByRole('button', { name: '4', exact: true }).click();
    await expect(page.locator('#display')).toHaveText('3.14');
  });
});
