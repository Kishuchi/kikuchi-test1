/**
 * おい、これがWeb電卓だぜ
 * 9桁まで表示できるし、小数も負の数もイケるからビビんなよ
 */
class Calculator {
  /**
   * 電卓の初期化だ、文句あっか？
   */
  constructor() {
    /** @type {HTMLElement} 計算結果を映すディスプレイだ、よく見とけ */
    this.display = document.getElementById('display');
    /** @type {string} 今入力してる値だ、忘れんなよ */
    this.currentValue = '0';
    /** @type {number|null} さっきの値だ、消えたらシラネーぞ */
    this.previousValue = null;
    /** @type {string|null} 今選んでる演算子だ */
    this.operator = null;
    /** @type {boolean} 次の入力待ちかどうかだ */
    this.waitingForOperand = false;
    /** @type {boolean} エラってるかどうかだ */
    this.hasError = false;
    /** @type {number} 最大9桁だ、それ以上は知らねぇ */
    this.maxDisplayLength = 9;

    this.init();
  }

  /**
   * イベント設定すんぞ、ついてこいよ
   */
  init() {
    // ボタン押したら反応すんだよ、当たり前だろ
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', () => this.handleButton(button));
    });

    // キーボードもイケるぜ、なめんなよ
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * ボタン押されたら俺が処理してやるよ
   * @param {HTMLButtonElement} button - 押されたボタンだ
   */
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

  /**
   * キーボードで来たやつも俺が捌くぜ
   * @param {KeyboardEvent} e - キーボードイベントだ
   */
  handleKeyboard(e) {
    // 数字キーだな、よっしゃ
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      this.inputNumber(e.key);
    }
    // 演算子キーかよ、任せろ
    else if (['+', '-', '*', '/'].includes(e.key)) {
      e.preventDefault();
      this.inputOperator(e.key);
    }
    // 小数点だな、オッケー
    else if (e.key === '.') {
      e.preventDefault();
      this.inputDecimal();
    }
    // 計算しろってか、いいぜ
    else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.calculate();
    }
    // クリアか、最初からやり直しだな
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      this.clear();
    }
    // バックスペースか、1個消してやるよ
    else if (e.key === 'Backspace') {
      e.preventDefault();
      this.backspace();
    }
  }

  /**
   * 数字入力だ、ガンガン打ってこいよ
   * @param {string} num - 入力された数字だ（0-9）
   */
  inputNumber(num) {
    // エラってたらまずクリアだろうが
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
        // 桁数オーバーすんなよ、9桁までだっつってんだろ
        const displayLength = this.getDisplayLength(this.currentValue + num);
        if (displayLength <= this.maxDisplayLength) {
          this.currentValue += num;
        }
      }
    }

    this.updateDisplay();
  }

  /**
   * 小数点入力だ、慎重にいけよ
   */
  inputDecimal() {
    // エラってたらまずクリアだ
    if (this.hasError) {
      this.clear();
    }

    if (this.waitingForOperand) {
      this.currentValue = '0.';
      this.waitingForOperand = false;
      this.updateDisplay();
      return;
    }

    // 小数点2個とかナメてんのか？
    if (this.currentValue.includes('.')) {
      return;
    }

    // 桁数チェックだ、オーバーすんなよ
    const displayLength = this.getDisplayLength(this.currentValue + '.');
    if (displayLength <= this.maxDisplayLength) {
      this.currentValue += '.';
    }

    this.updateDisplay();
  }

  /**
   * 演算子入力だ、足すのか引くのかハッキリしろよ
   * @param {string} op - 演算子だ（+, -, *, /）
   */
  inputOperator(op) {
    // エラってたらまずクリアだっつの
    if (this.hasError) {
      this.clear();
    }

    const currentNum = parseFloat(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = currentNum;
    } else if (!this.waitingForOperand) {
      // 連続計算もイケるぜ、すげぇだろ
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

  /**
   * 計算すんぞ、答え出してやるよ
   */
  calculate() {
    // エラってたら何もしねぇよ
    if (this.hasError) {
      return;
    }

    // 演算子も値もねぇのに計算できるわけねぇだろ
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

  /**
   * 四則演算だ、計算してやんよ
   * @param {number} num1 - 左の数字だ
   * @param {number} num2 - 右の数字だ
   * @param {string} operator - 演算子だ
   * @returns {number|string} 答えかエラーメッセージだ
   */
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
        // 0で割んなよ、数学なめんな
        if (num2 === 0) {
          return 'ZERO DIV';
        }
        result = num1 / num2;
        break;
      default:
        return num1;
    }

    // 変な数字になってねぇかチェックすんぞ
    if (!isFinite(result) || isNaN(result)) {
      return 'ERROR';
    }

    return result;
  }

  /**
   * 結果をキレイにフォーマットしてやんよ
   * @param {number} result - 計算結果だ
   * @returns {string} 整えた文字列か、ダメなら'ERROR'だ
   */
  formatResult(result) {
    // 表示できる桁数を計算すんぞ
    const isNegative = result < 0;
    let maxDigits = this.maxDisplayLength;
    
    if (isNegative) {
      maxDigits--; // マイナス記号分引くぞ
    }

    // 整数部が何桁あんのか数えんぞ
    const absResult = Math.abs(result);
    const integerPart = Math.floor(absResult);
    const integerDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;

    // 整数部だけでオーバーとかマジかよ
    if (integerDigits > maxDigits) {
      return 'ERROR';
    }

    // 小数があったら調整すんぞ
    if (result % 1 !== 0) {
      maxDigits--; // 小数点分も引くぞ
      const decimalPlaces = maxDigits - integerDigits;
      
      if (decimalPlaces > 0) {
        result = parseFloat(result.toFixed(decimalPlaces));
      } else {
        result = Math.round(result);
      }
    }

    let formatted = String(result);
    
    // 最終チェックだ、オーバーしてねぇよな？
    if (this.getDisplayLength(formatted) > this.maxDisplayLength) {
      return 'ERROR';
    }

    return formatted;
  }

  /**
   * 表示上の文字数を数えてやるよ
   * @param {string} value - 対象の文字列だ
   * @returns {number} 文字数だ、マイナスも小数点も1文字だからな
   */
  getDisplayLength(value) {
    return value.length;
  }

  /**
   * プラマイ切り替えだ、正負逆にしてやんよ
   */
  toggleSign() {
    // エラん時は何もしねぇ
    if (this.hasError) {
      return;
    }

    // 0にプラマイもクソもねぇだろ
    if (this.currentValue === '0') {
      return;
    }

    // 符号切り替えて桁数オーバーしねぇかチェック
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

  /**
   * 1文字消してやるよ、間違えたんだろ？
   */
  backspace() {
    // エラってたらクリアして終わりだ
    if (this.hasError) {
      this.clear();
      return;
    }

    // 演算子待ちん時は消せねぇよ
    if (this.waitingForOperand) {
      return;
    }

    // 1桁しかなかったら0にすんぞ
    if (this.currentValue.length === 1) {
      this.currentValue = '0';
    } else if (this.currentValue === '-0' || (this.currentValue.startsWith('-') && this.currentValue.length === 2)) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }

    this.updateDisplay();
  }

  /**
   * 全部リセットだ、最初っからやり直しだな
   */
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

  /**
   * エラー出すぞ、やらかしたな
   * @param {string} message - エラーメッセージだ（'ZERO DIV'か'ERROR'）
   */
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

  /**
   * ディスプレイ更新すんぞ、見とけよ
   */
  updateDisplay() {
    this.display.textContent = this.currentValue;
  }

  /**
   * 選んだ演算子を光らせてやるよ、カッケーだろ
   * @param {string} op - 光らせる演算子だ
   */
  updateOperatorHighlight(op) {
    this.clearOperatorHighlight();
    const operatorBtn = document.querySelector(`[data-value="${op}"]`);
    if (operatorBtn) {
      operatorBtn.classList.add('active');
    }
  }

  /**
   * 演算子の光消すぞ
   */
  clearOperatorHighlight() {
    document.querySelectorAll('.btn-operator').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

// 準備できたら電卓起動だ、待たせたな
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
