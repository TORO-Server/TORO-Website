# TORO-Website

マインクラフトのクリエイティブサーバー **TORO Server** の公式サイトの中身です。

- 公式サイト: https://www.torosaba.net/
- Wiki: [TORO-Server/TORO-Wiki](https://github.com/TORO-Server/TORO-Wiki)
- サイトの入口 (ドメイン名) の設定: [TORO-Server/TORO-Domain](https://github.com/TORO-Server/TORO-Domain)

## 中身

- `index.html` … サイト本体です。`404.html` は同じ内容のコピーです。
- `manifest.webmanifest`, `icons/`, `apple-touch-icon.png` … スマートフォンのホーム画面に追加するための設定とアイコンです。
- `offline.html` … ネットワークにつながらないときに表示するページです。
- `src/` … オフライン表示を支えるプログラムの元の TypeScript です。`sw.js` と `sw-register.js` は、ここから作られたファイルです。

## 作り直し

`src/` を変えたら、次のコマンドで `sw.js` と `sw-register.js` を作り直し、それもコミットしてください (公開側はリポジトリの中身をそのまま配るためです)。

```sh
npm install
npm run build
```

## 関連文書

- 全リポジトリ共通の文章の書き方: [docs/WRITING-STYLE.md](docs/WRITING-STYLE.md)
- ライセンス: `LICENSE` ファイルを参照してください。
