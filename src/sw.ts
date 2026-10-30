/// <reference lib="webworker" />
// TORO Server 公式サイトのサービスワーカー。
// 編集したら `npm run build` でルートの sw.js を作り直して、sw.js もコミットしてください。

export {}
declare const self: ServiceWorkerGlobalScope

// 中身 (下の SHELL や offline.html など) を変えたら番号を上げる。古いキャッシュは activate で消える。
const CACHE = 'toro-website-v1'
const OFFLINE_URL = '/offline.html'
const SHELL = [
  '/',
  OFFLINE_URL,
  '/logo.svg',
  '/manifest.webmanifest',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      // HTTP キャッシュを通さず、いまの版を取ってくる
      await cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  // 他のサイト (Wiki・Discord など) へのリクエストは触らない・キャッシュしない
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
  } else {
    event.respondWith(staleWhileRevalidate(request, event))
  }
})

function cacheable(response: Response): boolean {
  return response.ok && response.type === 'basic'
}

// ページを開くとき: まずネット、つながらなければキャッシュ、それもなければオフライン用ページ
async function networkFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (cacheable(response)) await cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true })
    if (cached) return cached
    const offline = await cache.match(OFFLINE_URL)
    return offline ?? new Response('オフラインです', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}

// 画像などの静的ファイル: キャッシュがあればすぐ返し、裏で新しいものに入れ替える
async function staleWhileRevalidate(request: Request, event: FetchEvent): Promise<Response> {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  const update = fetch(request).then(async (response) => {
    if (cacheable(response)) await cache.put(request, response.clone())
    return response
  })
  if (cached) {
    event.waitUntil(update.catch(() => undefined))
    return cached
  }
  return update
}
