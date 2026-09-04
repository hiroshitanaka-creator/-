(function startHaimachi(H) {
  "use strict";

  function boot() {
    try {
      const game = new H.Runtime.Game();
      window.__HAIMACHI_READY__ = true;
      window.dispatchEvent(new CustomEvent("haimachi:ready", { detail: { version: H.VERSION } }));
      return game;
    } catch (error) {
      console.error("Failed to boot Haimachi", error);
      const app = document.getElementById("app");
      if (app) {
        const panel = document.createElement("section");
        panel.className = "screen-overlay is-visible";
        panel.innerHTML = `<div class="paper-panel" style="padding:2rem;max-width:720px"><p class="eyebrow">起動エラー</p><h1>灰街を読み込めませんでした</h1><p>${H.Core?.Util?.escapeHTML(error.message) || "不明なエラー"}</p><pre style="white-space:pre-wrap;user-select:text">${H.Core?.Util?.escapeHTML(error.stack) || ""}</pre></div>`;
        app.appendChild(panel);
      }
      window.__HAIMACHI_READY__ = false;
      window.__HAIMACHI_BOOT_ERROR__ = error;
      return null;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})(window.Haimachi);
