from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import os

from predictor import Predictor
from train_model import train_and_evaluate

app = FastAPI(title="Bangla SMS Phishing Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = Predictor()

class SMSRequest(BaseModel):
    text: str
    model: str = None

@app.post("/api/predict")
def predict_sms(request: SMSRequest):
    if not predictor.is_ready():
        raise HTTPException(status_code=503, detail="Models not loaded. Train them first.")
    
    result = predictor.predict(request.text, request.model)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@app.post("/api/train")
def train_models():
    try:
        metadata = train_and_evaluate()
        predictor.load_models()
        return {"message": "Models trained successfully", "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metadata")
def get_metadata():
    if not predictor.is_ready():
        raise HTTPException(status_code=503, detail="Models not loaded. Train them first.")
    return predictor.metadata

# Serve frontend
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    # Strip query string component if present (FastAPI path doesn't include it)
    base = full_path.split("?")[0]
    if base == "app.js":
        return FileResponse(os.path.join(frontend_path, "app.js"))
    return FileResponse(os.path.join(frontend_path, "index.html"))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
