# TORO-Website

https://www.torosaba.net/

マインクラフトのクリエイティブサーバー **TORO Server** の公式サイトです。
いまは制作中のため、[TORO Status](https://status.torosaba.net/) と同じ 90 年代の個人ホームページ風デザインの「工事中」ページを置いています。
Wiki は [TORO-Server/TORO-Wiki-Site](https://github.com/TORO-Server/TORO-Wiki-Site) (https://wiki.torosaba.net/) です。

- `index.html` 1 枚だけの静的なページです。ビルドはありません。
- `main` ブランチのルートを GitHub Pages で公開しています (カスタムドメイン `www.torosaba.net`)。
- DNS は [TORO-Server/TORO-Domain](https://github.com/TORO-Server/TORO-Domain) で管理しています。

## torosaba.net (apex) から www への転送

`torosaba.net` は Minecraft の接続先 (Java 版 25565 / 統合版 20080) なので、A レコードは自宅サーバーの IP のまま (Cloudflare のプロキシなし) です。
Cloudflare のリダイレクトルールはプロキシが必要で、使うと Minecraft に接続できなくなるため、
ブラウザーで `torosaba.net` を開いた人を `https://www.torosaba.net/` へ送るのは、自宅サーバーの 80/443 番ポートで行います。

ルーターで TCP 80 / 443 を自宅サーバーへ転送したうえで、例えば [Caddy](https://caddyserver.com/) なら次の設定だけで、証明書の取得も自動です。

```caddyfile
torosaba.net {
	redir https://www.torosaba.net{uri} permanent
}
```

nginx なら (証明書は certbot などで取得):

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name torosaba.net;
    ssl_certificate     /etc/letsencrypt/live/torosaba.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/torosaba.net/privkey.pem;
    return 301 https://www.torosaba.net$request_uri;
}
```
