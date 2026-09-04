"""Standalone browser smoke test for constrained CI/chat environments.

The execution environment used for artifact generation may block file:// and localhost
navigation. This script loads the standalone HTML with Playwright set_content and injects
a small localStorage shim so the boot path can be exercised. Real local browsers do not
need the shim.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "dist" / "haimachi_chapter2_standalone.html").read_text(encoding="utf-8")
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)

LOCAL_STORAGE_SHIM = """
<script>
(() => {
  const store = new Map();
  const fake = {
    get length(){ return store.size; },
    key(i){ return Array.from(store.keys())[i] || null; },
    getItem(k){ return store.has(String(k)) ? store.get(String(k)) : null; },
    setItem(k,v){ store.set(String(k), String(v)); },
    removeItem(k){ store.delete(String(k)); },
    clear(){ store.clear(); }
  };
  try { Object.defineProperty(window, 'localStorage', { value: fake, configurable: true }); } catch(e) {}
  try { Object.defineProperty(window, 'sessionStorage', { value: fake, configurable: true }); } catch(e) {}
})();
</script>
"""

html = HTML.replace('<script data-source="js/namespace.js">', LOCAL_STORAGE_SHIM + '<script data-source="js/namespace.js">', 1)
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox", "--disable-dev-shm-usage"])
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page.on("console", lambda msg: errors.append(f"console {msg.type}: {msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
    page.set_content(html, wait_until="load", timeout=30000)
    page.wait_for_function("window.__HAIMACHI_READY__ === true", timeout=10000)
    page.screenshot(path=str(OUT / "title-desktop.png"), full_page=True)
    page.click("#newGameButton")
    page.wait_for_selector("#storyScreen.is-visible", timeout=5000)
    page.click("#storySkipButton")
    page.wait_for_selector("#hud:not(.is-hidden)", timeout=5000)
    page.wait_for_timeout(700)
    page.screenshot(path=str(OUT / "exploration-desktop.png"), full_page=True)
    page.keyboard.press("b")
    page.wait_for_selector('#sideDrawer[aria-hidden="false"]', timeout=5000)
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "deduction-desktop.png"), full_page=True)
    page.keyboard.press("Escape")
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "mobile-exploration.png"), full_page=True)
    snapshot = page.evaluate("window.haimachiMCP.getResourceSnapshot()")
    assert snapshot["chapter"] == "第二章　黒雨の帳簿"
    assert "chapter2" in snapshot["build"]
    browser.close()

if errors:
    raise SystemExit("\n".join(errors))
print("Browser smoke: pass")
