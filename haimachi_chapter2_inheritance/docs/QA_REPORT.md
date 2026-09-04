# QA検証結果 — 第二章「黒雨の帳簿」

検証日：2026年9月4日

## 1. 対象

- `index.html`
- 45本のゲーム用JavaScriptモジュール
- 4本のCSS
- 7地図、6地区、13NPC、39証拠、10推理、6任務、4敵、8結末
- 単一HTML生成物 `dist/haimachi_chapter2_standalone.html`

## 2. 静的検証

### JavaScript構文

全 `.js` ファイルへ `node --check` を実行し、構文エラー0件。

### データ参照整合性

`node tests/validate-data.js` で次を検査。

- ID重複
- 地図・出口・移動先座標
- NPCと会話の対応
- 証拠の入手経路
- 推理スロットと証拠ID
- 任務条件
- 敵・遭遇参照
- Story ID
- Effect type
- 結末ID
- 第二章の最良結末ID

結果：エラー0件、警告0件。

## 3. システムスモーク検証

`node tests/smoke-systems.js` で、DOMを使わない中核処理を最低限実行しました。

確認範囲：

- 第二章GameState生成
- WorldSystemの世界指標再計算
- RumorSystemの時間経過処理
- TimeSystemの時間進行
- EndingSystemの最良結末判定
- MCPBridgeの直接状態パッチ拒否
- MCPBridgeの候補提案受理

結果：通過。

## 4. 単一HTML生成

`python3 tools/build_standalone.py` でCSSとJavaScriptを内包した配布用HTMLを生成。

生成物：

```text
dist/haimachi_chapter2_standalone.html
```

## 5. ブラウザスモーク検証

この実行環境では `file://` と `localhost` へのChromiumナビゲーションが管理ポリシーで遮断されるため、Playwrightの `set_content` で単一HTMLを読み込み、localStorageシムを注入して起動経路を検証しました。実際のローカルブラウザではこのシムは不要です。

確認範囲：

- 単一HTMLの起動
- タイトル画面の描画
- 新規開始
- 導入スキップ後の探索HUD表示
- 推理盤ドロワー表示
- 390×844相当のスマートフォン表示
- MCP Resource Snapshotの `product` / `chapter` / `build` メタデータ
- ブラウザコンソールエラー0件

結果：通過。

生成スクリーンショット：

- `preview/title-desktop.png`
- `preview/exploration-desktop.png`
- `preview/deduction-desktop.png`
- `preview/mobile-exploration.png`

実機Safari、Android Chrome、長時間セーブ、全8結末の手動到達性は追加検証対象です。

## 6. 既知の制約

- Canvas表現は手続き描画で、専用ドット絵・専用BGMを使う製品版ほど演出密度はない
- 第一章から第二章へのセーブ移行UIは未実装。第二章は独立セーブとして起動する
- 全結末の自動到達テストは未実装
- MCP境界はブラウザ内の疑似インターフェースであり、実MCP Server接続は次フェーズ対象

## 7. 判定

第二章の静的整合性、システムスモーク、単一HTML生成、制約付きブラウザスモーク検証は通過しています。実機Safari、Android Chrome、長時間セーブ、全8結末到達性は製品化前の追加検証項目です。


## 2026-09-04 追加QA：第一章→第二章セーブ継承

- Chapter 1 JavaScript syntax: pass (`node --check` all modules)
- Chapter 1 data validation: 0 errors / 0 warnings
- Chapter 2 JavaScript syntax: pass (`node --check` all modules)
- Chapter 2 data validation: 0 errors / 0 warnings
- Chapter 2 system smoke: pass
- Chapter 2 transfer smoke: pass
- Standalone rebuild: pass
- Verified transfer payload type: `haimachi.chapter1.transfer`
- Verified applied state changes: inherited flag, player name, Naira trust increase, Eld-related rumor reduction, audit hall unlock, faction state object updates
