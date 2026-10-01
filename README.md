# Bangla SMS Phishing Detection System

A machine-learning-based web application to detect whether a Bangla SMS is Normal, Smish (Phishing), or Promotional. Built for a university project.

## Features
- **Bangla Language Support**: Fully supports UTF-8 and handles Bangla text without corruption.
- **Local Machine Learning Models**: Uses Logistic Regression and Naive Bayes trained on local CSV data.
- **Rule-Based Indicators**: Detects suspicious URLs, urgency keywords, and financial terms in Bangla.
- **Professional Dashboard**: Clean, modern interface built with React and Tailwind CSS.
- **Detailed Analytics**: Explore dataset metrics and model performance natively.
- **100% Local**: No external API calls, databases, or Docker required.

## Technologies
- **Backend**: Python, FastAPI, Scikit-Learn, Pandas
- **Frontend**: HTML5, React (via CDN), Tailwind CSS
- **Models**: TF-IDF Vectorization, Logistic Regression, Multinomial Naive Bayes

## Folder Structure
```text
bangla-sms-phishing-detector/
│
├── backend/
│   ├── main.py                # FastAPI server & frontend serving
│   ├── train_model.py         # ML training script
│   ├── predictor.py           # ML prediction logic
│   ├── preprocessing.py       # Bangla text cleaning
│   ├── feature_detection.py   # Phishing rule-based indicator check
│   ├── requirements.txt       # Python dependencies
│   ├── dataset/
│   │   └── dataset.csv        # Primary SMS dataset
│   └── models/                # Saved trained models (.pkl)
│
├── frontend/
│   ├── index.html             # UI Entry point
│   └── app.js                 # React Dashboard code
│
├── README.md
├── setup.bat                  # Installs dependencies and trains models
└── start.bat                  # Starts the application
```

## Setup & Installation
1. Ensure you have **Python 3.9+** installed on your system.
2. Place your target CSV file in `backend/dataset/` and rename it to `dataset.csv`.
3. Double-click `setup.bat`. This will install all dependencies and train the ML models automatically.

## How to Start Application
Once setup is complete, simply double-click `start.bat`. 
The application will start the local server and automatically open your default browser to `http://localhost:8000`.

## How Prediction Works
1. When you paste an SMS and click "Analyze", it is cleaned using our custom Bangla text preprocessor.
2. It's converted into numbers using the saved TF-IDF vectorizer.
3. The selected ML model (Logistic Regression or Naive Bayes) calculates class probabilities and makes a prediction.
4. At the same time, the `feature_detection.py` script scans the original text for malicious URLs, financial keywords (like 'টাকা', 'বিকাশ'), and urgency indicators.
5. Both results are presented cleanly on the UI.

## How to explain the project during viva
- **Demonstrate Data**: Show the Analytics tab to explain that the dataset has 2,772 messages with a balanced class distribution.
- **Demonstrate ML Pipeline**: Go to the "Model Info" tab. Explain that TF-IDF changes words into numerical features.
- **Show Evaluation**: Go to "Dataset Analytics" and show the Accuracy/F1 table. Explain that the model evaluates its predictions on unseen test data.
- **Live Demo**: 
  - Use the "Demo: Normal" button to show a safe text.
  - Use "Demo: Smish" to show how phishing (with links and financial keywords) gets caught by both ML and Rule-based indicators.

## Troubleshooting
- **No models found**: Ensure you ran `setup.bat` or run `python train_model.py` manually inside the `backend` folder.
- **Port in use**: If port 8000 is used by another app, you can change it at the bottom of `backend/main.py`.
