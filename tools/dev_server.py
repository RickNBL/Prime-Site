#!/usr/bin/env python3
"""Servidor local simples para visualizar o site sem instalar dependências."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
PORT = int(os.environ.get("PORT", "8000"))

if __name__ == "__main__":
    os.chdir(ROOT)
    print(f"Prime Terceirizados: http://127.0.0.1:{PORT}")
    print("Observação: o formulário PHP não é executado por este servidor Python.")
    ThreadingHTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler).serve_forever()
