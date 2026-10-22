from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .questions import QUESTIONS
from .schemas import AnswerResult, AnswerSubmission, Question

app = FastAPI(title="AZ-900 Unofficial Study Tool")

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


@app.get("/questions", response_model=list[Question])
def get_questions():
    return QUESTIONS


@app.post("/answers", response_model=AnswerResult)
def submit_answer(submission: AnswerSubmission):
    question = next(
        (item for item in QUESTIONS if item["id"] == submission.question_id),
        None,
    )
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    return AnswerResult(
        correct=submission.selected_index == question["correct_index"],
        explanation=question["explanation"],
        correct_index=question["correct_index"],
    )


@app.get("/progress")
def get_progress():
    return {
        "total_answered": 18,
        "correct_count": 13,
        "percentage": 72.2,
        "topic_breakdown": {
            "Cloud Concepts": 83.3,
            "Azure Architecture and Services": 70.0,
            "Azure Management and Governance": 62.5,
        },
    }
