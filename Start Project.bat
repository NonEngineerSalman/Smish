@echo off
echo =========================================
echo Starting Bangla SMS Phishing Detector
echo =========================================
echo Starting local server...

cd backend
start "Bangla SMS Phishing Detection API" python main.py

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Opening browser...
start http://localhost:8000

echo.
echo Application is running! Keep this window open.
echo Close this window to stop the server.
pause
