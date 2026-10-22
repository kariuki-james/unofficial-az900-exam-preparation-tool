from typing import Literal

from pydantic import BaseModel


class Question(BaseModel):
    id: int
    topic: Literal[
        "Cloud Concepts",
        "Azure Architecture and Services",
        "Azure Management and Governance",
    ]
    question: str
    options: list[str]
    correct_index: int
    explanation: str


class AnswerSubmission(BaseModel):
    question_id: int
    selected_index: int


class AnswerResult(BaseModel):
    correct: bool
    explanation: str
    correct_index: int
