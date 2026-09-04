@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
  py start_server.py
  goto :eof
)
where python >nul 2>&1
if %errorlevel%==0 (
  python start_server.py
  goto :eof
)
echo Python が見つかりません。
echo dist\haimachi_chapter2_standalone.html をダブルクリックしてください。
pause
