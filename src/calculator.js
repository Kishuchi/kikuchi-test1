/**
 * Web電卓アプリケーション
 * 最大9桁表示、小数・負の数対応
 */

class Calculator {
  constructor() {
    this.display = document.getElementById('display');
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.hasError = false;
    this.maxDisplayLength = 9;

    this.init();
  }

  init() {
    // ボタンクリックイベント
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', () => this.handleButton(button));
    });

    // キーボードイベント
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleButton(button) {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'number':
        this.inputNumber(value);
        break;
      case 'operator':
        this.inputOperator(value);
        break;
      case 'decimal':
        this.inputDecimal();
        break;
      case 'equals':
        this.calculate();
        break;
      case 'clear':
        this.clear();
        break;
      case 'toggle-sign':
        this.toggleSign();
        break;
      case 'backspace':
        this.backspace();
        break;
    }
  }

  handleKeyboard(e) {
    // 数字キー
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      this.inputNumber(e.key);
    }
    // 演算子キー
    else if (['+', '-', '*', '/'].includes(e.key)) {
      e.preventDefault();
      this.inputOperator(e.key);
    }
    // 小数点
    else if (e.key === '.') {
      e.preventDefault();
      this.inputDecimal();
    }
    // 計算実行
    else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.calculate();
    }
    // クリア
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      this.clear();
    }
    // バックスペース
    else if (e.key === 'Backspace') {
      e.preventDefault();
      this.backspace();
    }
  }

  inputNumber(num) {
    if (this.hasError) {
      this.clear();
    }

    if (this.waitingForOperand) {
      this.currentValue = num;
      this.waitingForOperand = false;
    } else {
      if (this.currentValue === '0') {
        this.currentValue = num;
      } else {
        // 桁数チェック（マイナス記号と小数点を除いた数字の桁数）
        const displayLength = this.getDisplayLength(this.currentValue + num);
        if (displayLength <= this.maxDisplayLength) {
          this.currentValue += num;
        }
      }
    }

    this.updateDisplay();
  }

  inputDecimal() {
    if (this.hasError) {
      this.clear();
    }

    if (this.waitingForOperand) {
      this.currentValue = '0.';
      this.waitingForOperand = false;
      this.updateDisplay();
      return;
    }

    // 既に小数点があれば追加しない
    if (this.currentValue.includes('.')) {
      return;
    }

    // 桁数チェック
    const displayLength = this.getDisplayLength(this.currentValue + '.');
    if (displayLength <= this.maxDisplayLength) {
      this.currentValue += '.';
    }

    this.updateDisplay();
  }

  inputOperator(op) {
    if (this.hasError) {
      this.clear();
    }

    const currentNum = parseFloat(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = currentNum;
    } else if (!this.waitingForOperand) {
      const result = this.performCalculation(this.previousValue, currentNum, this.operator);
      
      if (result === 'ZERO DIV' || result === 'ERROR') {
        this.showError(result);
        return;
      }
      
      this.previousValue = result;
      this.currentValue = this.formatResult(result);
      this.updateDisplay();
    }

    this.operator = op;
    this.waitingForOperand = true;
    this.updateOperatorHighlight(op);
  }

  calculate() {
    if (this.hasError) {
      return;
    }

    if (this.operator === null || this.previousValue === null) {
      return;
    }

    const currentNum = parseFloat(this.currentValue);
    const result = this.performCalculation(this.previousValue, currentNum, this.operator);

    if (result === 'ZERO DIV' || result === 'ERROR') {
      this.showError(result);
      return;
    }

    this.currentValue = this.formatResult(result);
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = true;
    this.clearOperatorHighlight();
    this.updateDisplay();
  }

  performCalculation(num1, num2, operator) {
    let result;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          return 'ZERO DIV';
        }
        result = num1 / num2;
        break;
      default:
        return num1;
    }

    // 結果が有効な数値かチェック
    if (!isFinite(result) || isNaN(result)) {
      return 'ERROR';
    }

    return result;
  }

  formatResult(result) {
    // 表示可能な桁数を計算
    const isNegative = result < 0;
    let maxDigits = this.maxDisplayLength;
    
    if (isNegative) {
      maxDigits--; // マイナス記号分
    }

    // 整数部の桁数を計算
    const absResult = Math.abs(result);
    const integerPart = Math.floor(absResult);
    const integerDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;

    // 整数部だけで桁数オーバーの場合
    if (integerDigits > maxDigits) {
      return 'ERROR';
    }

    // 小数がある場合
    if (result % 1 !== 0) {
      maxDigits--; // 小数点分
      const decimalPlaces = maxDigits - integerDigits;
      
      if (decimalPlaces > 0) {
        result = parseFloat(result.toFixed(decimalPlaces));
      } else {
        result = Math.round(result);
      }
    }

    let formatted = String(result);
    
    // 表示桁数を超えていないか最終チェック
    if (this.getDisplayLength(formatted) > this.maxDisplayLength) {
      return 'ERROR';
    }

    return formatted;
  }

  getDisplayLength(value) {
    // 表示上の文字数を返す（マイナス記号、小数点も1文字としてカウント）
    return value.length;
  }

  toggleSign() {
    if (this.hasError) {
      return;
    }

    if (this.currentValue === '0') {
      return;
    }

    // 符号を切り替えた結果が桁数制限内かチェック
    if (this.currentValue.startsWith('-')) {
      this.currentValue = this.currentValue.slice(1);
    } else {
      const newValue = '-' + this.currentValue;
      if (this.getDisplayLength(newValue) <= this.maxDisplayLength) {
        this.currentValue = newValue;
      }
    }

    this.updateDisplay();
  }

  backspace() {
    if (this.hasError) {
      this.clear();
      return;
    }

    if (this.waitingForOperand) {
      return;
    }

    if (this.currentValue.length === 1) {
      this.currentValue = '0';
    } else if (this.currentValue === '-0' || (this.currentValue.startsWith('-') && this.currentValue.length === 2)) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }

    this.updateDisplay();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.hasError = false;
    this.display.classList.remove('error');
    this.clearOperatorHighlight();
    this.updateDisplay();
  }

  showError(message) {
    this.currentValue = message;
    this.previousValue = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.hasError = true;
    this.display.classList.add('error');
    this.clearOperatorHighlight();
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.textContent = this.currentValue;
  }

  updateOperatorHighlight(op) {
    this.clearOperatorHighlight();
    const operatorBtn = document.querySelector(`[data-value="${op}"]`);
    if (operatorBtn) {
      operatorBtn.classList.add('active');
    }
  }

  clearOperatorHighlight() {
    document.querySelectorAll('.btn-operator').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
