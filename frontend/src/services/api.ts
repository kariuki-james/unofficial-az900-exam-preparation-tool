import type { AnswerResult, ProgressData, Question } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_BASE}/questions`);

  if (!response.ok) {
    throw new Error("Failed to load questions");
  }

  return response.json();
}

export async function submitAnswer(
  questionId: number,
  selectedIndex: number,
): Promise<AnswerResult> {
  const response = await fetch(`${API_BASE}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: questionId,
      selected_index: selectedIndex,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answer");
  }

  return response.json();
}

export async function getProgress(): Promise<ProgressData> {
  const response = await fetch(`${API_BASE}/progress`);

  if (!response.ok) {
    throw new Error("Failed to load progress");
  }

  return response.json();
}
