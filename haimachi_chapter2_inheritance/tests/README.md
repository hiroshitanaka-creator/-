# Tests

## データ参照整合性

```bash
node tests/validate-data.js
```

地図、NPC、証拠、推理、任務、敵、物語、結末のID参照と条件・効果を検証します。

## システムスモーク検証

```bash
node tests/smoke-systems.js
```

DOMを使わず、第二章GameState生成、噂進行、時間進行、最良結末判定、MCP候補検証を実行します。
