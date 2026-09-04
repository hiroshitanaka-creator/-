import time
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT = Path('/mnt/data/haimachi_chapter2_screens')
OUT.mkdir(exist_ok=True)
URL = 'file:///mnt/data/haimachi_chapter2_standalone.html'

def click_through_story(page, tap=False):
    for i in range(10):
        try:
            if page.locator('#storyNextButton').is_visible(timeout=500):
                if tap: page.tap('#storyNextButton')
                else: page.click('#storyNextButton')
                time.sleep(0.25)
            else:
                break
        except Exception:
            break

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--allow-file-access-from-files'])
    page = browser.new_page(viewport={'width':1440,'height':900}, device_scale_factor=1)
    errors=[]
    page.on('console', lambda msg: errors.append(msg.text) if msg.type=='error' else None)
    page.goto(URL, wait_until='load')
    page.wait_for_function("window.__HAIMACHI_READY__ === true", timeout=10000)
    page.screenshot(path=str(OUT/'01_title_desktop.png'), full_page=False)
    page.click('#newGameButton')
    time.sleep(0.5)
    click_through_story(page)
    time.sleep(0.8)
    page.screenshot(path=str(OUT/'02_world_desktop.png'), full_page=False)
    for name, btn, fname in [('evidence','button[data-panel="evidence"]','03_evidence_desktop.png'),('deduction','button[data-panel="deduction"]','04_deduction_desktop.png'),('map','button[data-panel="map"]','05_map_desktop.png')]:
        try:
            page.click(btn, timeout=2000)
            time.sleep(0.4)
            page.screenshot(path=str(OUT/fname), full_page=False)
            page.keyboard.press('Escape')
            time.sleep(0.2)
        except Exception as e:
            print('panel failed', name, e)
    m = browser.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    m.goto(URL, wait_until='load')
    m.wait_for_function("window.__HAIMACHI_READY__ === true", timeout=10000)
    m.screenshot(path=str(OUT/'06_title_mobile.png'), full_page=False)
    m.tap('#newGameButton')
    time.sleep(0.5)
    click_through_story(m, tap=True)
    time.sleep(0.8)
    m.screenshot(path=str(OUT/'07_world_mobile.png'), full_page=False)
    browser.close()
    if errors:
        print('CONSOLE_ERRORS')
        for e in errors[:20]: print(e)
    else:
        print('Standalone browser screenshots OK; console errors: 0')
