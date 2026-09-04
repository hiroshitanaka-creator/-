# Assets

現行版は、外部画像・音声ファイルへ依存していません。

- 世界・NPC・噂獣：Canvasによる手続き描画
- UI・紙面・雨・照明：CSSとCanvas
- 音：Web Audio APIによる生成音

将来アセットを追加する場合は、次の下位フォルダを推奨します。

```text
assets/
  characters/
  environment/
  ui/
  fx/
  audio/
```
