const CACHE_NAME = "haimachi-chapter2-pwa-v1.2.0-bright";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./css/theme.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/responsive.css",
  "./js/namespace.js",
  "./js/core/utilities.js",
  "./js/core/event-bus.js",
  "./js/core/rng.js",
  "./js/core/conditions.js",
  "./js/core/state-factory.js",
  "./js/core/save-manager.js",
  "./js/core/audio-manager.js",
  "./js/core/input-manager.js",
  "./js/data/config.js",
  "./js/data/evidence.js",
  "./js/data/npcs.js",
  "./js/data/maps.js",
  "./js/data/dialogues.js",
  "./js/data/deductions.js",
  "./js/data/quests.js",
  "./js/data/enemies.js",
  "./js/data/story.js",
  "./js/data/endings.js",
  "./js/systems/effect-system.js",
  "./js/systems/time-system.js",
  "./js/systems/world-system.js",
  "./js/systems/movement-system.js",
  "./js/systems/interaction-system.js",
  "./js/systems/evidence-system.js",
  "./js/systems/dialogue-system.js",
  "./js/systems/deduction-system.js",
  "./js/systems/quest-system.js",
  "./js/systems/rumor-system.js",
  "./js/systems/combat-system.js",
  "./js/systems/progression-system.js",
  "./js/systems/ending-system.js",
  "./js/systems/mcp-bridge.js",
  "./js/systems/chapter-transfer.js",
  "./js/render/canvas-renderer.js",
  "./js/render/combat-renderer.js",
  "./js/ui/dom.js",
  "./js/ui/panels.js",
  "./js/ui/deduction-board.js",
  "./js/ui/dialogue-panel.js",
  "./js/ui/combat-panel.js",
  "./js/ui/report-panel.js",
  "./js/ui/touch-controls.js",
  "./js/ui/ui-manager.js",
  "./js/game.js",
  "./js/main.js",
  "./js/pwa-register.js",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-192.png",
  "./assets/icons/maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("haimachi-chapter2-pwa-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(response => {
          const copy = response.clone();
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => request.mode === "navigate" ? caches.match("./offline.html") : Promise.reject(new Error("offline")));
    })
  );
});
