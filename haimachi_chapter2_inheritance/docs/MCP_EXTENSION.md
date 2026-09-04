# MCP拡張設計 — 第二章対応

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

秘密の真相、未発見証拠の本文、NPCの隠し動機、結末条件の完全式は公開しません。

### 候補提出

```javascript
window.haimachiMCP.submitProposal({
  type: "rumor_candidate",
  title: "名前が濡れる夜",
  text: "黒雨で消えた名は、公債担保欄に番号として戻る",
  sourceNpcId: "lio",
  risk: 2
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

## 4. 第二章で有効なMCP Server案

### 4.1 World Resource Server

読み取り専用で、公式世界状態の公開可能部分をResource化します。

```text
haimachi://world/current
haimachi://district/east
haimachi://case/black-rain/public
haimachi://npc/mira/public-memory
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

### 4.3 Ledger Consistency Server

帳簿、救済名簿、公債担保、予算請求の対応関係を候補グラフとして返します。

正式採用条件：

- 登録済み証拠IDだけを参照する
- 名簿番号と公債番号の対応が一対一または説明可能
- 推理盤の論理スロットを満たす
- プレイヤー未発見の真相を本文で漏らさない

### 4.4 Map Revision Server

公式地図と影地図の差分を読み、次の探索候補を提案します。鏡面水路のような隠し区域は、ゲーム側の推理条件を満たしたときだけ正式解放されます。

### 4.5 Faction Intent Server

監査庁、公債商、鐘楼師、閉鎖評議が「次に何をしたいか」の候補を出します。実際の行動は、資源、所在地、恐怖、権限、既知情報をゲーム側で検証してからイベント化します。

## 5. 採用イベント形式

MCP候補を正式イベントへ変換する際は、自由な状態パッチではなく、登録済みイベント型へ落とします。

```json
{
  "schema": "haimachi-event-candidate-v1",
  "proposal_id": "p-20260904-001",
  "type": "rumor_candidate",
  "source": "npc-memory-server",
  "inputs_revision": "world-checksum",
  "payload": {
    "speaker_id": "lio",
    "district_id": "east",
    "statement": "救済券の番号は、公債担保欄で雨粒の形に並び替えられている"
  },
  "constraints": {
    "requires_known_fact": ["e2_missing_name_notice"],
    "max_intensity_delta": 3
  }
}
```

採用側は、`inputs_revision` が現在の世界revisionと一致するかを確認します。古い状態に基づく提案は再評価または破棄します。

## 6. 責務分離

| 層 | 責務 | 禁止事項 |
|---|---|---|
| ブラウザゲーム | UI、入力、Canvas描画、ローカルセーブ、候補の受け口 | AI出力を無検証で正式状態にする |
| ゲームロジック | GameState、条件判定、推理成立、結末判定 | 自然文だけでルールを上書きする |
| MCP Server | 記憶、候補生成、外部文書変換、補助グラフ | 未発見証拠を正式証拠として追加する |
| AIモデル | 証言文、噂文、説明文、派閥提案 | 数値状態や結末を直接決める |
| 外部サービス | 文書、時刻、天気、ニュース等の素材 | 現実データを無変換で事件へ反映する |

## 7. 最終進化形

第二章のMCP高度利用では、プレイヤーの報告書が灰街の公式Resourceになり、NPCと派閥がその報告を参照して次章の行動候補を作ります。

ただし正式な採用は、常にゲーム側のValidatorを通します。
