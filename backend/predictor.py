import os
import json
import joblib
import numpy as np
from preprocessing import clean_text
from feature_detection import check_indicators

class Predictor:
    def __init__(self):
        self.vectorizer = None
        self.models = {}
        self.metadata = {}
        self.load_models()
        
    def load_models(self):
        try:
            self.vectorizer = joblib.load(os.path.join("models", "tfidf_vectorizer.pkl"))
            self.models['logistic'] = joblib.load(os.path.join("models", "logistic_model.pkl"))
            self.models['naive_bayes'] = joblib.load(os.path.join("models", "naive_bayes_model.pkl"))
            self.models['knn'] = joblib.load(os.path.join("models", "knn_model.pkl"))
            self.models['random_forest'] = joblib.load(os.path.join("models", "random_forest_model.pkl"))
            self.models['decision_tree'] = joblib.load(os.path.join("models", "decision_tree_model.pkl"))
            with open(os.path.join("models", "metadata.json"), "r", encoding='utf-8') as f:
                self.metadata = json.load(f)
        except Exception as e:
            print("Could not load models. Please train them first.", e)
            
    def is_ready(self):
        return self.vectorizer is not None and len(self.models) > 0
        
    def predict(self, text: str, model_name: str = None):
        if not self.is_ready():
            return {"error": "Models are not loaded."}
            
        if not model_name:
            model_name = self.metadata.get("best_model", "logistic")
            
        model = self.models.get(model_name)
        if not model:
            return {"error": f"Model {model_name} not found."}
            
        cleaned = clean_text(text)
        vec = self.vectorizer.transform([cleaned])
        
        pred = model.predict(vec)[0]
        proba = model.predict_proba(vec)[0]
        
        classes = model.classes_
        probabilities = {cls: float(p) for cls, p in zip(classes, proba)}
        
        confidence = probabilities[pred]
        
        indicators = check_indicators(text)
        
        return {
            "prediction": pred,
            "confidence": confidence,
            "probabilities": probabilities,
            "indicators": indicators,
            "used_model": model_name
        }
