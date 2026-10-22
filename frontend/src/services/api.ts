const API_BASE = "http://localhost:8000";

export async function getQuestions() {
  const res = await fetch(`${API_BASE}/questions`);
  return res.json();
}
