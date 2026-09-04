# 技術アーキテクチャ

## 1. 基本方針

本作はCanvas描画とDOM UIを併用します。

- Canvas：街、人物、雨、照明、遭遇物、カメラ
- DOM：HUD、会話、調査、証拠台帳、推理盤、戦闘コマンド、正式報告、設定
- JavaScript状態：正式なゲーム状態とルール

レンダラーを状態の正本にしません。セーブ可能な状態は、DOMやCanvasオブジェクトを含まないJSON互換データです。

## 2. 起動順

`index.html` は次の順でスクリプトを読み込みます。

1. 名前空間
2. Core
3. Data
4. Systems
5. Render
6. UI
7. Game runtime
8. Main boot

ビルドツールなしでも依存順序が明示され、`file://` と静的HTTPの両方で起動できます。

## 3. 状態所有権

正式状態は `StateFactory` が生成します。

```text
state
├─ meta          バージョン、作成時刻、プレイ時間、チェックサム
├─ settings      難易度、音量、表示、オートセーブ
├─ player        位置、能力、経験値、平静、所持品
├─ world         時刻、地区、噂、フラグ、イベント履歴、結末
├─ npcs          信頼、状態、現在位置、会話記憶
├─ evidence      発見済み証拠、発見文脈
├─ deductions    成立済み推理、試行履歴
├─ quests        任務状態と段階
├─ combat        対峙中のみ存在する戦闘状態
└─ ui            デバッグ等の保存可能UI設定
```

## 4. Core

### `utilities.js`

クランプ、深い複製、距離、衝突、文字エスケープ、日時表現などの純粋関数です。

### `event-bus.js`

システムとUI間の通知を疎結合にします。

### `conditions.js`

証拠、推理、任務、フラグ、NPC状態、地区状態、難易度などを宣言的に評価します。

### `state-factory.js`

新規状態の生成と、旧セーブを読み込む際の正規化を担当します。

### `save-manager.js`

- オートセーブ
- 手動セーブ
- JSON書き出し・読み込み
- 設定の永続化
- チェックサム更新

### `input-manager.js`

物理キーと仮想スティックを `move`、`interact`、`journal` 等の論理操作へ変換します。

## 5. データ駆動コンテンツ

`js/data/` の各ファイルは、物語コンテンツをコードロジックから分離します。

- `maps.js`：障害物、出口、調査地点、遭遇、装飾
- `npcs.js`：人物の初期状態と役割
- `dialogues.js`：条件付き話題、選択肢、効果
- `evidence.js`：証拠分類、説明、タグ、信頼性
- `deductions.js`：論理スロット、前提推理、成立効果
- `quests.js`：段階、目的、完了効果
- `enemies.js`：噂の主張、弱点、攻撃、勝利効果
- `story.js`：章導入・節目の物語表示
- `endings.js`：正式報告と世界状態から選ぶ結末

## 6. Effect System

コンテンツデータは、直接状態を書き換えず `EffectSystem` へ効果を渡します。

代表的な効果：

```text
evidence
npcTrust
npcState
world
district
rumor
questStart
questComplete
mapUnlock
story
combat
openReport
```

これにより、会話、現場調査、推理、戦闘が同じ更新経路を使います。

## 7. システム境界

### WorldSystem

地図移動、地区集計、街の安定度・噂圧の再計算を担当します。

### TimeSystem / RumorSystem

行動コストに応じて時間を進め、難易度補正をかけて噂・恐怖・信頼を変化させます。

### InteractionSystem

現在地からNPC、出口、調査地点、遭遇を構築し、最寄り対象を決めます。

### DialogueSystem

信頼と条件に基づく話題・選択肢を処理します。

### DeductionSystem

証拠組み合わせを論理スロットへ割り当て、前提推理と重複使用を検査します。

### CombatSystem

噂の強度、段階、主張、焦点、権限、群衆不安、証拠の反復減衰を処理します。

### EndingSystem

正式報告と救出・保護・街状態を評価し、結末を決定します。

## 8. 描画境界

`CanvasRenderer` は状態を読み、次を描画します。

- 地面、道路、水路、建物、家具
- 雨、霧、照明
- NPC、遭遇物、プレイヤー
- 相互作用可能対象の強調
- カメラ追従

`CombatRenderer` は戦闘状態から噂獣の形状・粒子・消散を描きます。

描画オブジェクトはセーブされません。

## 9. UI境界

UIはイベントを受けて表示し、プレイヤー操作をシステムへ戻します。

- `UIManager`：画面モード、HUD、通知、設定反映
- `Panels`：記録、証拠、地図、人物、設定
- `DeductionBoard`：証拠選択と推理検証
- `DialoguePanel`：話題・選択肢
- `CombatPanel`：論証戦コマンド
- `ReportPanel`：正式報告
- `TouchControls`：仮想スティック

## 10. セーブ互換性

長編化では次を守ります。

1. `meta.schemaVersion` を更新する
2. `normalizeLoaded` で不足フィールドを補う
3. コンテンツIDを不用意に変更しない
4. 削除済み証拠・任務IDを読み込んだ場合の移行表を用意する
5. レンダラー固有状態をセーブへ入れない

## 11. 新コンテンツ追加手順

### 地図

1. `maps.js` に地図を追加
2. `Config.districts[].mapIds` へ登録
3. 既存地図から出口を作る
4. `node tests/validate-data.js` を実行

### 証拠と推理

1. `evidence.js` に一意IDで証拠を追加
2. 会話・調査・戦闘のいずれかへ入手効果を追加
3. `deductions.js` の論理グループへ登録
4. 推理成立時の世界効果を定義
5. 推理なしでも拾う意味があるか確認

### NPC

1. `npcs.js` に人物を追加
2. `dialogues.js` に同じIDの会話を追加
3. 地図内座標と初期状態を設定
4. 信頼の上下が情報・安全・結末のいずれへ影響するか定義

## 12. 性能方針

- フレームごとの状態深複製は行わない
- Canvas描画は現在地図だけ
- DOMの長い一覧はドロワーを開いた時に再構築
- 自動保存はデバウンス
- 将来、NPC数や都市シミュレーションが増えた場合はWeb Workerへ伝播計算を分離
