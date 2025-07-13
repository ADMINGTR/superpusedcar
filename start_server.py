#!/usr/bin/env python3
"""
Simple HTTP Server for testing YouTube API
Run this script and then visit http://localhost:8000/youtubeg.html
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Change to the website directory
    website_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(website_dir)
    
    # Create the server
    handler = CORSHTTPRequestHandler
    httpd = socketserver.TCPServer(("", PORT), handler)
    
    print(f"🌐 Starting HTTP server on port {PORT}")
    print(f"📁 Serving directory: {website_dir}")
    print(f"🚀 Opening browser to: http://localhost:{PORT}/youtubeg.html")
    print("Press Ctrl+C to stop the server")
    
    # Open browser automatically
    webbrowser.open(f'http://localhost:{PORT}/youtubeg.html')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == "__main__":
    main()
