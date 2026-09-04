# iPhone PWA版の使い方 — 灰街の巡察官と嘘の地図 第二章

## 結論

iPhoneでホーム画面アプリ化するには、`haimachi_chapter2` フォルダをHTTPSで公開し、Safariで開いて「ホーム画面に追加」してください。

## 手順

1. ZIPを展開する
2. `haimachi_chapter2` フォルダ全体をGitHub Pages、Netlify、Vercel、Cloudflare Pagesなどに置く
3. iPhoneのSafariで公開URLを開く
4. 共有ボタン → 「ホーム画面に追加」
5. ホーム画面の「灰街 第二章」から起動する

## 注意

- `file://` でHTMLを直接開く方式ではPWAとしてインストールできません。
- iPhoneでService Workerを有効にするには、原則HTTPS配信が必要です。
- 一度読み込みが完了すれば、主要ファイルはキャッシュされ、次回以降の起動が速くなります。

## 同梱内容

- `manifest.webmanifest`
- `sw.js`
- `offline.html`
- iPhone用 `apple-touch-icon.png`
- PWA登録スクリプト `js/pwa-register.js`


## 継承テスト用サンプル

`examples/chapter1_true_map_transfer_sample.json` を第二章タイトル画面で読み込むと、最良結末相当の第一章データを使って継承挙動を確認できます。実プレイでは第一章から書き出したJSONを使用してください。
