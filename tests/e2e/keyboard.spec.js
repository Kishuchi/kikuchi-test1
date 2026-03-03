// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('キーボード入力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('数字キーで入力できること', async ({ page }) => {
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    await expect(page.locator('#display')).toHaveText('123');
  });

  test('演算子キーで計算できること', async ({ page }) => {
    await page.keyboard.press('5');
    await page.keyboard.press('+');
    await page.keyboard.press('3');
    await page.keyboard.press('Enter');
    await expect(page.locator('#display')).toHaveText('8');
  });

  test('Escapeキーでクリアできること', async ({ page }) => {
    await page.keyboard.press('5');
    await page.keyboard.press('Escape');
    await expect(page.locator('#display')).toHaveText('0');
  });

  test('Backspaceキーで削除できること', async ({ page }) => {
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    await page.keyboard.press('Backspace');
    await expect(page.locator('#display')).toHaveText('12');
  });

  test('小数点キーで入力できること', async ({ page }) => {
    await page.keyboard.press('3');
    await page.keyboard.press('.');
    await page.keyboard.press('1');
    await page.keyboard.press('4');
    await expect(page.locator('#display')).toHaveText('3.14');
  });

  test('=キーで計算できること', async ({ page }) => {
    await page.keyboard.press('6');
    await page.keyboard.press('*');
    await page.keyboard.press('7');
    await page.keyboard.press('=');
    await expect(page.locator('#display')).toHaveText('42');
  });
});
