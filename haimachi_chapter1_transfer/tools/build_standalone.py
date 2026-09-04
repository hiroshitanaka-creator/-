#!/usr/bin/env python3
"""index.html のローカルCSS/JSを埋め込み、単一HTML版を生成する。"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "index.html"
OUTPUT = ROOT / "dist" / "haimachi_chapter1_standalone.html"

STYLE_RE = re.compile(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*>')
SCRIPT_RE = re.compile(r'<script\s+src="([^"]+)"\s*></script>')


def read_text(relative: str) -> str:
    path = (ROOT / relative).resolve()
    if ROOT not in path.parents:
        raise ValueError(f"プロジェクト外の参照は埋め込めません: {relative}")
    return path.read_text(encoding="utf-8")


def main() -> int:
    html = SOURCE.read_text(encoding="utf-8")

    def inline_style(match: re.Match[str]) -> str:
        href = match.group(1)
        if href.startswith(("http://", "https://", "data:")):
            return match.group(0)
        return f'<style data-source="{href}">\n{read_text(href)}\n</style>'

    def inline_script(match: re.Match[str]) -> str:
        src = match.group(1)
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)
        code = read_text(src).replace("</script>", "<\\/script>")
        return f'<script data-source="{src}">\n{code}\n</script>'

    html = STYLE_RE.sub(inline_style, html)
    html = SCRIPT_RE.sub(inline_script, html)
    html = html.replace(
        "</head>",
        "  <meta name=\"haimachi-build\" content=\"standalone\">\n</head>",
        1,
    )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Generated: {OUTPUT}")
    print(f"Bytes: {OUTPUT.stat().st_size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
