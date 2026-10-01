@echo off
echo =========================================
echo Setting up Bangla SMS Phishing Detector
echo =========================================
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Training Machine Learning models (this may take a minute)...
python train_model.py
echo.
echo Setup Complete!
echo You can now double-click start.bat to run the application.
pause
