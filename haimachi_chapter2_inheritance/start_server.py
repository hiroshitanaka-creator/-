#!/usr/bin/env python3
"""灰街の巡察官と嘘の地図 — ローカル起動サーバー。"""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import os
import socket
import sys
import threading
import time
import webbrowser
from pathlib import Path


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        print(f"[灰街] {self.address_string()} - {fmt % args}")

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="灰街 第二章をローカルブラウザで起動します。")
    parser.add_argument("--host", default="127.0.0.1", help="待受アドレス。既定: 127.0.0.1")
    parser.add_argument("--port", type=int, default=8080, help="ポート。既定: 8080")
    parser.add_argument("--no-browser", action="store_true", help="ブラウザを自動で開かない")
    return parser.parse_args()


def port_is_available(host: str, port: int) -> bool:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.settimeout(0.4)
        return sock.connect_ex((host, port)) != 0


def open_browser(url: str) -> None:
    time.sleep(0.45)
    try:
        webbrowser.open(url, new=2)
    except Exception as exc:  # pragma: no cover - OS依存
        print(f"ブラウザを自動で開けませんでした: {exc}", file=sys.stderr)


def main() -> int:
    args = parse_args()
    root = Path(__file__).resolve().parent
    os.chdir(root)

    if not (1 <= args.port <= 65535):
        print("ポートは1〜65535で指定してください。", file=sys.stderr)
        return 2
    if not port_is_available(args.host, args.port):
        print(f"{args.host}:{args.port} はすでに使用されています。--port 9000 などを指定してください。", file=sys.stderr)
        return 2

    handler = functools.partial(QuietHandler, directory=str(root))
    try:
        server = http.server.ThreadingHTTPServer((args.host, args.port), handler)
    except OSError as exc:
        print(f"サーバーを開始できません: {exc}", file=sys.stderr)
        return 2

    url_host = "127.0.0.1" if args.host in {"0.0.0.0", "::"} else args.host
    url = f"http://{url_host}:{args.port}/"
    print("=" * 56)
    print("灰街の巡察官と嘘の地図 — 第二章「黒雨の帳簿」")
    print(f"起動URL: {url}")
    print("終了するには、この画面で Ctrl+C を押してください。")
    print("=" * 56)

    if not args.no_browser:
        threading.Thread(target=open_browser, args=(url,), daemon=True).start()

    try:
        server.serve_forever(poll_interval=0.25)
    except KeyboardInterrupt:
        print("\n灰街を終了します。")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
