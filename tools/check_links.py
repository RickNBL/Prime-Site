#!/usr/bin/env python3
"""Valida referências locais de href/src nos arquivos HTML do projeto."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]

class RefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        for key in ("href", "src"):
            value = data.get(key)
            if value:
                self.refs.append(value)


def local_target(html_file: Path, ref: str):
    if ref.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
        return None
    parsed = urlparse(ref)
    path = unquote(parsed.path)
    if not path:
        return None
    if path.startswith("/"):
        return ROOT / path.lstrip("/")
    return html_file.parent / path

errors = []
for html_file in sorted(ROOT.glob("*.html")):
    parser = RefParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    for ref in parser.refs:
        target = local_target(html_file, ref)
        if target is not None and not target.exists():
            errors.append((html_file.name, ref, target.relative_to(ROOT) if ROOT in target.parents else target))

if errors:
    print("Referências locais ausentes:")
    for file, ref, target in errors:
        print(f"- {file}: {ref} -> {target}")
    sys.exit(1)

print("OK: todas as referências locais de href/src existem.")
