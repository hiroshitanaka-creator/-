from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess, time, socket, os, signal

root = Path(__file__).resolve().parents[1]
out = root / 'screenshots'
out.mkdir(exist_ok=True)
port = 8765

def wait_port(port, timeout=5):
    start=time.time()
    while time.time()-start<timeout:
        with socket.socket() as s:
            try:
                s.connect(('127.0.0.1', port)); return True
            except OSError:
                time.sleep(0.05)
    return False

server = subprocess.Popen(['python3','-m','http.server',str(port),'--bind','127.0.0.1'], cwd=str(root), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    assert wait_port(port), 'server did not start'
    url = f'http://127.0.0.1:{port}/dist/haimachi_chapter2_standalone.html'
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1440, 'height':900}, device_scale_factor=1)
        console_errors=[]
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda err: console_errors.append(str(err)))
        page.goto(url, wait_until='load')
        page.wait_for_timeout(700)
        page.screenshot(path=str(out/'chapter2_01_title_desktop.png'), full_page=True)
        page.locator('#newGameButton').click()
        page.wait_for_timeout(600)
        page.screenshot(path=str(out/'chapter2_02_story_intro.png'), full_page=True)
        if page.locator('#storySkipButton').is_visible():
            page.locator('#storySkipButton').click()
        page.wait_for_timeout(1200)
        page.screenshot(path=str(out/'chapter2_03_game_start_desktop.png'), full_page=True)
        page.keyboard.press('V')
        page.wait_for_timeout(500)
        page.screenshot(path=str(out/'chapter2_04_evidence_panel.png'), full_page=True)
        page.keyboard.press('Escape')
        page.wait_for_timeout(300)
        page.keyboard.press('B')
        page.wait_for_timeout(500)
        page.screenshot(path=str(out/'chapter2_05_deduction_panel.png'), full_page=True)
        m = browser.new_page(viewport={'width':390, 'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        mobile_errors=[]
        m.on('console', lambda msg: mobile_errors.append(msg.text) if msg.type == 'error' else None)
        m.on('pageerror', lambda err: mobile_errors.append(str(err)))
        m.goto(url, wait_until='load')
        m.wait_for_timeout(700)
        m.screenshot(path=str(out/'chapter2_06_mobile_title.png'), full_page=True)
        m.locator('#newGameButton').click()
        m.wait_for_timeout(600)
        if m.locator('#storySkipButton').is_visible():
            m.locator('#storySkipButton').click()
        m.wait_for_timeout(1200)
        m.screenshot(path=str(out/'chapter2_07_mobile_game.png'), full_page=True)
        browser.close()
    print('desktop_console_errors=', len(console_errors))
    for e in console_errors[:10]: print('ERR', e)
    print('mobile_console_errors=', len(mobile_errors))
    for e in mobile_errors[:10]: print('MERR', e)
finally:
    server.terminate()
    try: server.wait(timeout=2)
    except subprocess.TimeoutExpired: server.kill()
