from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

app = FastAPI()

# Enable CORS (for frontend compatibility)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

class RequestData(BaseModel):
    responses: list[str]

def analyze_response(response: str) -> int:
    sentiment_score = sia.polarity_scores(response)['compound']
    if sentiment_score >= 0.5:
        return 0
    elif sentiment_score >= 0.2:
        return 2
    elif sentiment_score >= -0.2:
        return 5
    elif sentiment_score >= -0.5:
        return 7
    else:
        return 10

@app.post("/api/analyze")
async def analyze(data: RequestData):
    risk_scores = [analyze_response(response) for response in data.responses]
    overall_score = sum(risk_scores) / len(risk_scores) if risk_scores else 0
    return {"riskScores": risk_scores, "overallScore": overall_score}

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}

@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon available"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
