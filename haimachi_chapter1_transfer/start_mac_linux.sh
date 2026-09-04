#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  exec python3 start_server.py
elif command -v python >/dev/null 2>&1; then
  exec python start_server.py
else
  echo "Python が見つかりません。dist/haimachi_chapter1_standalone.html をブラウザで開いてください。" >&2
  exit 1
fi
