import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .questions import QUESTIONS
from .schemas import AnswerResult, AnswerSubmission, Question

app = FastAPI(title="AZ-900 Unofficial Study Tool")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USER_ID = "demo"

TOPICS = [
    "Cloud Concepts",
    "Azure Architecture and Services",
    "Azure Management and Governance",
]

PROGRESS_STORE: dict[str, dict[str, dict[str, int]]] = {
    USER_ID: {topic: {"answered": 0, "correct": 0} for topic in TOPICS}
}


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

    is_correct = submission.selected_index == question["correct_index"]

    topic_progress = PROGRESS_STORE[USER_ID][question["topic"]]
    topic_progress["answered"] += 1
    if is_correct:
        topic_progress["correct"] += 1

    return AnswerResult(
        correct=is_correct,
        explanation=question["explanation"],
        correct_index=question["correct_index"],
    )


@app.get("/progress")
def get_progress():
    user_progress = PROGRESS_STORE[USER_ID]
    total_answered = sum(stats["answered"] for stats in user_progress.values())
    correct_count = sum(stats["correct"] for stats in user_progress.values())

    percentage = (
        round((correct_count / total_answered) * 100, 1) if total_answered > 0 else 0.0
    )

    topic_breakdown: dict[str, float] = {}
    for topic in TOPICS:
        stats = user_progress[topic]
        topic_breakdown[topic] = (
            round((stats["correct"] / stats["answered"]) * 100, 1)
            if stats["answered"] > 0
            else 0.0
        )

    return {
        "total_answered": total_answered,
        "correct_count": correct_count,
        "percentage": percentage,
        "topic_breakdown": topic_breakdown,
    }
