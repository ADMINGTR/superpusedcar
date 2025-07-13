@echo off
echo 🌐 Starting YouTube API Test Server...
echo.
echo This will start a local web server so the YouTube API can work properly
echo The server will automatically open your browser to test the YouTube page
echo.
echo Press Ctrl+C to stop the server when you're done testing
echo.
pause

python start_server.py

pause
