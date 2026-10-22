from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .questions import QUESTIONS

app = FastAPI(title="AZ-900 Unofficial Study Tool")

# CORS — allows the React dev server to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "tool": "Unofficial AZ-900 Study Tool"}