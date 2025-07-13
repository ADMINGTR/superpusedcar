import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8000

def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    
    # Add CORS headers
    class CORSHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    try:
        with socketserver.TCPServer(("", PORT), CORSHandler) as httpd:
            print(f"🌐 Server running at http://localhost:{PORT}")
            print(f"📁 Serving files from: {httpd.server_address}")
            print(f"🚀 YouTube page: http://localhost:{PORT}/youtubeg.html")
            print("Press Ctrl+C to stop")
            
            # Open browser after 2 seconds
            def open_browser():
                time.sleep(2)
                webbrowser.open(f'http://localhost:{PORT}/youtubeg.html')
            
            threading.Thread(target=open_browser, daemon=True).start()
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    start_server()
