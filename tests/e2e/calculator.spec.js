// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('電卓アプリケーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('基本表示', () => {
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

  test.describe('数字入力', () => {
    test('数字ボタンで入力できること', async ({ page }) => {
      await page.click('[data-value="1"]');
      await page.click('[data-value="2"]');
      await page.click('[data-value="3"]');
      await expect(page.locator('#display')).toHaveText('123');
    });

    test('0から始まる場合、先頭の0は表示されないこと', async ({ page }) => {
      await page.click('[data-value="0"]');
      await page.click('[data-value="5"]');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('小数点を入力できること', async ({ page }) => {
      await page.click('[data-value="3"]');
      await page.click('[data-action="decimal"]');
      await page.click('[data-value="1"]');
      await page.click('[data-value="4"]');
      await expect(page.locator('#display')).toHaveText('3.14');
    });

    test('小数点は1つまでしか入力できないこと', async ({ page }) => {
      await page.click('[data-value="3"]');
      await page.click('[data-action="decimal"]');
      await page.click('[data-value="1"]');
      await page.click('[data-action="decimal"]');
      await page.click('[data-value="4"]');
      await expect(page.locator('#display')).toHaveText('3.14');
    });
  });

  test.describe('四則演算', () => {
    test('加算ができること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-value="+"]');
      await page.click('[data-value="3"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('8');
    });

    test('減算ができること', async ({ page }) => {
      await page.click('[data-value="9"]');
      await page.click('[data-value="-"]');
      await page.click('[data-value="4"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('乗算ができること', async ({ page }) => {
      await page.click('[data-value="6"]');
      await page.click('[data-value="*"]');
      await page.click('[data-value="7"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('42');
    });

    test('除算ができること', async ({ page }) => {
      await page.click('[data-value="8"]');
      await page.click('[data-value="/"]');
      await page.click('[data-value="2"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('4');
    });

    test('小数の計算ができること', async ({ page }) => {
      await page.click('[data-value="1"]');
      await page.click('[data-action="decimal"]');
      await page.click('[data-value="5"]');
      await page.click('[data-value="+"]');
      await page.click('[data-value="2"]');
      await page.click('[data-action="decimal"]');
      await page.click('[data-value="5"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('4');
    });

    test('連続計算ができること', async ({ page }) => {
      await page.click('[data-value="2"]');
      await page.click('[data-value="+"]');
      await page.click('[data-value="3"]');
      await page.click('[data-value="+"]');
      await expect(page.locator('#display')).toHaveText('5');
      await page.click('[data-value="4"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('9');
    });
  });

  test.describe('負の数', () => {
    test('符号を切り替えられること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-action="toggle-sign"]');
      await expect(page.locator('#display')).toHaveText('-5');
    });

    test('負の数から正の数に戻せること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-action="toggle-sign"]');
      await page.click('[data-action="toggle-sign"]');
      await expect(page.locator('#display')).toHaveText('5');
    });

    test('負の数の計算ができること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-action="toggle-sign"]');
      await page.click('[data-value="+"]');
      await page.click('[data-value="3"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('-2');
    });
  });

  test.describe('エラー処理', () => {
    test('ゼロ除算で"ZERO DIV"が表示されること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-value="/"]');
      await page.click('[data-value="0"]');
      await page.click('[data-action="equals"]');
      await expect(page.locator('#display')).toHaveText('ZERO DIV');
    });

    test('エラー後にクリアで復帰できること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-value="/"]');
      await page.click('[data-value="0"]');
      await page.click('[data-action="equals"]');
      await page.click('[data-action="clear"]');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('エラー後に数字入力で新しい計算を開始できること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-value="/"]');
      await page.click('[data-value="0"]');
      await page.click('[data-action="equals"]');
      await page.click('[data-value="7"]');
      await expect(page.locator('#display')).toHaveText('7');
    });
  });

  test.describe('機能ボタン', () => {
    test('クリアボタンで初期化されること', async ({ page }) => {
      await page.click('[data-value="1"]');
      await page.click('[data-value="2"]');
      await page.click('[data-value="3"]');
      await page.click('[data-action="clear"]');
      await expect(page.locator('#display')).toHaveText('0');
    });

    test('バックスペースで1文字削除できること', async ({ page }) => {
      await page.click('[data-value="1"]');
      await page.click('[data-value="2"]');
      await page.click('[data-value="3"]');
      await page.click('[data-action="backspace"]');
      await expect(page.locator('#display')).toHaveText('12');
    });

    test('1桁の状態でバックスペースを押すと0になること', async ({ page }) => {
      await page.click('[data-value="5"]');
      await page.click('[data-action="backspace"]');
      await expect(page.locator('#display')).toHaveText('0');
    });
  });

  test.describe('キーボード入力', () => {
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

  test.describe('桁数制限', () => {
    test('9桁まで入力できること', async ({ page }) => {
      for (let i = 0; i < 9; i++) {
        await page.click('[data-value="1"]');
      }
      await expect(page.locator('#display')).toHaveText('111111111');
    });

    test('9桁を超えて入力できないこと', async ({ page }) => {
      for (let i = 0; i < 10; i++) {
        await page.click('[data-value="1"]');
      }
      await expect(page.locator('#display')).toHaveText('111111111');
    });
  });
});
