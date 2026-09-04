(function registerHaimachiPWA() {
  "use strict";
  const isSecureLike = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!("serviceWorker" in navigator) || !isSecureLike) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).then(registration => {
      window.__HAIMACHI_PWA__ = { registered: true, scope: registration.scope };
    }).catch(error => {
      window.__HAIMACHI_PWA__ = { registered: false, error: error.message };
      console.warn("Haimachi PWA registration failed", error);
    });
  }, { once: true });
})();
