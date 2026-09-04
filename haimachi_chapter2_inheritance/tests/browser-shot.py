import http.server, socketserver, threading, time, os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path('/mnt/data/haimachi_chapter2_work/haimachi_chapter2')
OUT = Path('/mnt/data/haimachi_chapter2_screens')
OUT.mkdir(exist_ok=True)
PORT = 8097

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

os.chdir(ROOT)
httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

def wait_ready(page):
    page.wait_for_function("window.__HAIMACHI_READY__ === true", timeout=10000)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':900}, device_scale_factor=1)
    console_errors=[]
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type=='error' else None)
    page.goto(f'http://127.0.0.1:{PORT}/index.html', wait_until='load')
    wait_ready(page)
    page.screenshot(path=str(OUT/'01_title_desktop.png'), full_page=False)
    page.click('#newGameButton')
    time.sleep(0.5)
    # progress story; click next several times until hud visible or button gone
    for i in range(8):
        try:
            if page.locator('#storyNextButton').is_visible():
                page.click('#storyNextButton')
                time.sleep(0.25)
            else:
                break
        except Exception:
            break
    time.sleep(0.8)
    page.screenshot(path=str(OUT/'02_world_desktop.png'), full_page=False)
    # open evidence / deduction / map panels
    for name, btn, fname in [('evidence','button[data-panel="evidence"]','03_evidence_desktop.png'),('deduction','button[data-panel="deduction"]','04_deduction_desktop.png'),('map','button[data-panel="map"]','05_map_desktop.png')]:
        try:
            page.click(btn)
            time.sleep(0.3)
            page.screenshot(path=str(OUT/fname), full_page=False)
            page.keyboard.press('Escape')
            time.sleep(0.2)
        except Exception as e:
            print('panel failed', name, e)
    # mobile boot/start
    m = browser.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    m.goto(f'http://127.0.0.1:{PORT}/index.html', wait_until='load')
    m.wait_for_function("window.__HAIMACHI_READY__ === true", timeout=10000)
    m.screenshot(path=str(OUT/'06_title_mobile.png'), full_page=False)
    m.tap('#newGameButton')
    time.sleep(0.5)
    for i in range(8):
        try:
            if m.locator('#storyNextButton').is_visible():
                m.tap('#storyNextButton')
                time.sleep(0.25)
            else:
                break
        except Exception:
            break
    time.sleep(0.8)
    m.screenshot(path=str(OUT/'07_world_mobile.png'), full_page=False)
    browser.close()
    if console_errors:
        print('CONSOLE_ERRORS')
        for e in console_errors[:20]: print(e)
    else:
        print('Browser screenshots OK; console errors: 0')
httpd.shutdown()
