# Web電卓アプリケーション

![Test and Deploy](https://github.com/Kishuchi/kikuchi-test1/actions/workflows/deploy.yml/badge.svg)

デモ用のWeb電卓アプリケーションです。

## 機能

- 四則演算（加算、減算、乗算、除算）
- 小数・負の数のサポート
- キーボード入力対応
- モバイルフレンドリーなUI

## 技術スタック

- HTML5 / CSS3 / JavaScript
- E2Eテスト: Playwright
- CI/CD: GitHub Actions

## 対応環境

- Microsoft Edge（最新版）
- モバイルデバイス対応

## ドキュメント

- [機能要件書](docs/requirements/functional-requirements.md)
- [非機能要件書](docs/requirements/non-functional-requirements.md)

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# E2Eテストの実行
npm test
```

## ディレクトリ構成

```
├── docs/
│   └── requirements/
│       ├── functional-requirements.md
│       └── non-functional-requirements.md
├── src/
│   ├── index.html
│   ├── styles.css
│   └── calculator.js
├── tests/
│   └── e2e/
│       └── calculator.spec.js
└── .github/
    └── workflows/
        └── ci.yml
```

## ライセンス

MIT
