// CSP でインラインのスクリプトを禁止しているので、登録はファイルに分ける
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
