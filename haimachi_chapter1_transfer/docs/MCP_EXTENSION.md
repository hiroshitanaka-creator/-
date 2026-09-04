# MCP拡張設計

## 1. 原則

MCP・AIモデルは正式ゲーム状態の所有者ではありません。

```text
MCP / AI
  ↓ 候補提案
Schema Validation
  ↓
Rule Validation
  ↓
Budget / Safety Validation
  ↓
Deterministic Adoption
  ↓
Official GameState
```

AIの文章が説得力を持っていても、登録済み証拠、事件グラフ、時間、NPC知識範囲、世界ルールと矛盾する場合は採用しません。

## 2. 現在のブラウザ境界

`window.haimachiMCP` は、将来のMCPクライアント接続を模した境界です。

### Resource取得

```javascript
window.haimachiMCP.getResourceSnapshot();
```

公開される内容：

- 時計・天候
- プレイヤーの位置・能力・レベル
- 街の安定度・信頼・噂圧
- 地区の公開状態
- 活性化している噂
- 発見済み証拠ID
- 成立済み推理ID
- 任務の公開状態
- NPCの公開可能な信頼・状態・位置
- 不変ルール

秘密の真相、未発見証拠の本文、NPCの隠し動機は公開しません。

### 候補提出

```javascript
window.haimachiMCP.submitProposal({
  type: "rumor_candidate",
  title: "北水門の鐘",
  text: "雨鐘が三度鳴ると水路の道が現れる",
  sourceNpcId: "elka",
  risk: 1
});
```

許可済み候補種別：

- `npc_memory_append`
- `rumor_candidate`
- `quest_candidate`
- `faction_intent`

返却値 `status: "candidate_only"` は、正式状態へ未反映であることを示します。

## 3. 拒否する入力

- `state_patch`
- 任意 `path` の直接書き換え
- `patch` / `state` を含む提案
- 未登録証拠IDを正式証拠として追加する提案
- 上限を超える文章・効果数
- 許可されていない提案種別

## 4. 推奨MCP Server群

### 4.1 World Resource Server

読み取り専用で、公式世界状態の公開可能部分をResource化します。

```text
haimachi://world/current
haimachi://district/north
haimachi://case/rain-bell/public
haimachi://npc/mirei/public-memory
```

### 4.2 NPC Memory Server

NPCごとの主観記憶を保持します。記憶は次の区分を持ちます。

```text
observed      本人が観測した
heard         誰かから聞いた
inferred      本人が推測した
fabricated    意図的に作った
superseded    後に訂正された
```

ゲーム側は記憶を事実として扱わず、会話候補生成の入力として使います。

### 4.3 Rumor Propagation Server

噂の文面変形、伝播経路、NPCごとの解釈候補を作ります。

正式な強度・信頼度・地区恐怖への影響は、決定論的な `RumorSystem` が計算します。

### 4.4 Case Candidate Server

新事件の候補グラフを作ります。

必要な出力：

- 固定された真相
- 登場人物と知識範囲
- 時系列
- 入手可能な証拠
- 誤情報と発生源
- 各推理の論理スロット
- 最低一つの反証経路
- 失敗時の世界状態変化

生成後、`Case Validator` が到達可能性、無矛盾性、証拠不足、一本道化を検査します。

### 4.5 Faction Intent Server

派閥が「何をしたいか」の候補を出します。実際の行動は、資源、所在地、恐怖、権限、既知情報をゲーム側で検証してからイベント化します。

## 5. 採用イベント形式

MCP候補を正式イベントへ変換する際は、自由な状態パッチではなく、登録済みイベント型へ落とします。

```json
{
  "schema": "haimachi-event-candidate-v1",
  "proposal_id": "p-20260903-001",
  "type": "rumor_candidate",
  "source": "npc-memory-server",
  "inputs_revision": "world-checksum",
  "payload": {
    "speaker_id": "mirei",
    "district_id": "north",
    "statement": "巡察隊は雨鐘が鳴る前から北倉を閉じていた"
  },
  "constraints": {
    "requires_known_fact": ["north_warehouse_closed"],
    "max_intensity_delta": 3
  }
}
```

採用側は、`inputs_revision` が現在の世界revisionと一致するかを確認します。古い状態に基づく提案は再評価または破棄します。

## 6. ブラウザ・ゲームサーバー・MCP・AIの責務

| 層 | 責務 | 禁止事項 |
|---|---|---|
| ブラウザ | 入力、描画、UI、ローカルキャッシュ | AI出力を直接GameStateへ適用 |
| ゲームサーバー | 正式状態、イベント採用、同期、セーブ | 自然言語だけで真偽を決定 |
| MCP Server | Resource公開、候補生成、外部接続 | 無制限の任意状態書き換え |
| AIモデル | 証言文、主観記憶、派閥意図、事件候補 | 証拠成立・戦闘結果の最終裁定 |
| 外部サービス | 天気、時刻、文書などの素材 | 現実データを無変換で世界へ反映 |

## 7. 導入段階

### 段階0：現行版

- 完全ローカル
- 固定コンテンツ
- `window.haimachiMCP` で境界を模擬

### 段階1：読み取り専用MCP

- World Resource公開
- セーブデータ・事件ログの外部可視化
- 書き込みなし

### 段階2：候補生成

- NPC記憶文
- 噂の変形候補
- 派閥意図
- すべて候補キュー止まり

### 段階3：決定論的採用

- Schema、revision、条件、予算、禁止効果を検査
- 登録済みイベント型だけ採用
- 採用理由・拒否理由を監査ログへ記録

### 段階4：長期都市シミュレーション

- NPC同士の情報共有
- 複数事件間の噂・派閥・地図変化
- AI Game Masterは候補配分を担当
- 正式世界線はOrchestratorのみ更新

## 8. セキュリティと品質リスク

- 外部文書内のプロンプトインジェクション
- 個人情報・秘密情報のNPC記憶混入
- 生成事件の解けなさ
- AIが未発見の真相を会話で漏らす
- 同じ世界revisionへ競合提案が届く
- AI障害時にゲームが停止する

対策：

- 外部文書を命令ではなく非信頼データとして処理
- 公開Resourceと秘密Stateを分離
- 事件候補をオフライン検証してから登録
- NPCごとに知識許可リストを持つ
- revisionとイベントIDで競合制御
- AI/MCPがなくても固定コンテンツへフォールバック
