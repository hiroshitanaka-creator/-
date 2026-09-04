# QA検証結果

検証日：2026年9月3日

## 1. 対象

- `index.html`
- 45本のゲーム用JavaScriptモジュール
- 4本のCSS
- 6地図、12NPC、32証拠、9推理、6任務、5敵、8結末
- 単一HTML生成物

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

結果：エラー0件、警告0件。

## 3. デスクトップ実ブラウザ検証

環境：Chromium、1440×900

確認済み：

- タイトル表示
- プレイヤー名入力
- 難易度選択
- 新規開始
- 導入4場面
- Canvas探索画面
- WASD移動
- NPC会話
- 会話選択による証拠取得
- 現場調査
- 地図出口による区域移動
- 記録帳ドロワー
- 証拠台帳
- 推理盤
- 噂との対峙
- 正式報告
- 結末画面
- 手動セーブ・ロード
- MCP直接状態書き換え拒否

コンソールエラー：0件。

## 4. スマートフォン表示検証

環境：390×844、Device Scale Factor 2、タッチ入力

確認済み：

- タイトル画面の縦スクロール
- セーフエリアを考慮したHUD
- 仮想スティック
- 調査ボタン
- 下部クイックバー
- 全画面ドロワー
- 通知とモーダルの重なり順
- 文字切れ・操作領域の主要競合なし

コンソールエラー：0件。

## 5. 深部フロー検証

次の統合経路を実ブラウザで完走。

```text
新規開始
→ 3種の証拠を正式取得
→ 推理盤で「灰獣跡は偽装」を成立
→ 成立フラグを確認
→ 偽灰獣との論証戦
→ 観察
→ 証拠提示
→ 推理提示
→ 行政封印
→ 勝利
→ 正式GameStateの遭遇解決を確認
→ 探索へ復帰
→ 手動セーブ
→ 状態変更
→ ロード復元
→ 最終報告
→ 最良結末
```

全チェック成功、コンソールエラー0件。

## 6. 地図・操作経路検証

実際の入力経路で確認。

- キーボード入力で正式プレイヤー座標が変化
- ナイラとの会話開始
- 地図院旧版地図の調査UI
- 地図院出口から中央区へ移動
- 中央区北門から北区へ移動
- 全6地図の描画・相互作用リスト再構築
- `file://` から単体起動

全チェック成功、コンソールエラー0件。

## 7. 修正済み不具合

- PC画面にもスマートフォン用操作が表示される
- 通知がスマートフォンの記録帳より前面に出る
- スマートフォンのクイックバーと仮想スティックが競合する
- 世界指標再計算のたびに信頼値が変化し、ロード値がずれる
- 解決済み推理で使用証拠が表示されない
- 戦闘勝利直前に敵描画が先に消える
- タイトルへ戻った後に物語キューが残る
- favicon要求による404

## 8. 既知の制約

- Safari実機、Firefox実機、Android実機での端末別QAは未実施
- キーボードのゲームパッド割り当ては未実装
- 複数章のセーブ移行は未実装
- Canvas表現は手続き描画で、外部アセットを使う製品版ほど演出量はない
- 自動E2Eテストスクリプトは開発環境依存のため配布物へ含めず、データ検証のみ同梱

## 9. 判定

第一章の主要ゲームループは、PC・スマートフォン相当表示・単体ファイル起動で評価可能な状態です。

ただし、複数章を含む長編完成版としての判定ではありません。次段階では実機Safari、Android Chrome、長時間セーブ、全8結末の手動到達性、難易度別バランスの追加検証が必要です。


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
