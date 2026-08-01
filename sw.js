/* OmniCounter 서비스워커 · v24.1-alpha.3 · 2026-08-01
 *
 * 설계 원칙 — 이 파일이 릴리스 정합성을 깨지 않게 하는 것이 최우선이다(v16 ■13.3 / G1).
 *   1) navigation(문서) 요청은 **network-first**. 새 배포가 즉시 사용자에게 도달해야 한다.
 *      캐시는 오프라인일 때만 쓰인다. 캐시 우선으로 하면 배포해도 구버전이 계속 보인다 — 그것이 D-2급 사고다.
 *   2) 캐시 이름에 버전을 박고, activate에서 **다른 이름의 캐시를 전부 삭제**한다.
 *   3) skipWaiting + clients.claim — 갱신이 다음 방문까지 미뤄지지 않는다.
 *   4) 교차 출처(외부 CDN)는 건드리지 않는다. 통과시킨다.
 *
 * 킬스위치(롤백):
 *   이 파일을 아래 3줄짜리 본문으로 교체해 배포하면 모든 사용자 기기에서 스스로 해제된다.
 *     self.addEventListener("install", () => self.skipWaiting());
 *     self.addEventListener("activate", (e) => e.waitUntil((async () => {
 *       for (const k of await caches.keys()) await caches.delete(k);
 *       await self.registration.unregister();
 *       for (const c of await self.clients.matchAll()) c.navigate(c.url);
 *     })()));
 */
"use strict";

const VERSION = "v24.1-alpha.3";
const CACHE = "omni-" + VERSION;
const PRECACHE = ["./", "./index.html", "./ux-v241a3.js", "./alpha-v241a3.js", "./qr.png"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      // 실패해도 설치는 계속된다 — 프리캐시 실패가 앱 사용을 막으면 안 된다.
      await Promise.allSettled(PRECACHE.map(u => cache.add(new Request(u, { cache: "reload" }))));
    } catch (e) { /* 무시: 캐시 불가 환경에서도 앱은 정상 동작해야 한다 */ }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    } catch (e) { /* 무시 */ }
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "OMNI_SW_VERSION" && event.source) {
    event.source.postMessage({ type: "OMNI_SW_VERSION", version: VERSION, cache: CACHE });
  }
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;   // 외부 CDN 등은 통과

  const isDoc = req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  event.respondWith((async () => {
    /* --- network-first: 온라인이면 항상 최신을 준다 --- */
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === "basic") {
        const copy = fresh.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return fresh;
    } catch (e) {
      /* --- 네트워크 불가(오프라인)일 때만 캐시 --- */
      const cached = await caches.match(req);
      if (cached) return cached;
      if (isDoc) {
        const shell = await caches.match("./index.html") || await caches.match("./");
        if (shell) return shell;
      }
      return new Response(
        "오프라인이고 저장된 사본도 없습니다. / Offline and no cached copy available.",
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }
  })());
});
