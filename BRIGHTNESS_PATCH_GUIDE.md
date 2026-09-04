# GitHub Pages公開版 明るさ改善パッチ v1.0

このパッチは、iPhoneで探索画面が暗く見える問題を改善するためのものです。

## 修正対象ファイル

- `haimachi_chapter1_transfer/css/layout.css`
- `haimachi_chapter1_transfer/js/core/state-factory.js`
- `haimachi_chapter1_transfer/js/ui/panels.js`
- `haimachi_chapter1_transfer/js/ui/ui-manager.js`
- `haimachi_chapter1_transfer/js/render/canvas-renderer.js`
- `haimachi_chapter2_inheritance/css/layout.css`
- `haimachi_chapter2_inheritance/js/core/state-factory.js`
- `haimachi_chapter2_inheritance/js/ui/panels.js`
- `haimachi_chapter2_inheritance/js/ui/ui-manager.js`
- `haimachi_chapter2_inheritance/js/render/canvas-renderer.js`
- `sw.js`
- `haimachi_chapter2_inheritance/sw.js`

## 主要変更値

| 項目 | 変更前 | 変更後 | iPhone時 |
|---|---:|---:|---:|
| Canvas明度 | なし | brightness(1.16) | brightness(1.26) |
| Canvasコントラスト | なし | contrast(1.08) | contrast(1.10) |
| DOM雨レイヤー基本不透明度 | .20前後 | .10前後 | .07前後 |
| rainGlass動的係数 | 0.04 + rain * .22 | 0.02 + rain * .10 | 0.012 + rain * .07 |
| ビネット | 150px / 35px / .58 | 110px / 18px / .38 | 78px / 8px / .24 |
| 通常暗幕 | .13 | .065 | .045 |
| 危険マップ暗幕 | .42 | .30 | .24 |
| 周辺減光 | .35 + 圧*.32 | .14 + 圧*.16 | .09 + 圧*.12 |
| Canvas雨量 | 100% | 72% | 58% |
| Canvas雨透明度 | 100% | 68% | 52% |
| プレイヤー視認補助 | なし | 足元リング+縁取り | 強め |
| 調査地点視認補助 | 弱い | 発光リング | 強め |

## iPhone推奨設定

ゲーム内の「設定」で以下を推奨します。

- 明るい探索表示：ON
- 雨の前景演出：ONまたはOFF。見えにくければOFF
- 高コントラスト：通常はOFF。屋外で暗い場合はON
- 動きを減らす：酔いやすい場合はON
- 文字を大きくする：任意

## GitHub Pages反映時の注意

PWAはService Workerが古いファイルを保持する場合があります。`sw.js` のキャッシュ名を更新済みなので、アップロード後にiPhone Safariでページを再読み込みしてください。古い画面が残る場合は、ホーム画面のアイコンを削除してから追加し直すと確実です。
