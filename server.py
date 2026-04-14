#!/usr/bin/env python3
import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

# 明确设置工作目录
PROJECT_DIR = "/Users/apple/Documents/New project 2"
os.chdir(PROJECT_DIR)

PORT = 8080

print(f"Starting server in {os.getcwd()}")
print(f"Serving at port {PORT}")

handler = SimpleHTTPRequestHandler
httpd = HTTPServer(('0.0.0.0', PORT), handler)
httpd.serve_forever()
