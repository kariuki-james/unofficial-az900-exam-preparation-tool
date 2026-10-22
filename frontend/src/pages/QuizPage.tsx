import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import QuizCard, { type QuizCardState } from "../components/QuizCard";
import { getQuestions, submitAnswer } from "../services/api";
import type { AnswerResult, Question } from "../types";

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getQuestions()
      .then((data) => {
        if (!cancelled) {
          setQuestions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load questions. Make sure the backend is running.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  function getCardState(index: number): QuizCardState {
    if (result) {
      if (index === result.correct_index) {
        return "correct";
      }

      if (index === selectedIndex) {
        return "wrong";
      }

      return "dimmed";
    }

    return selectedIndex === null ? "idle" : "dimmed";
  }

  async function handleAnswer(index: number) {
    if (!currentQuestion || selectedIndex !== null) {
      return;
    }

    setSelectedIndex(index);
    setSubmitError(null);

    try {
      const answerResult = await submitAnswer(currentQuestion.id, index);
      setResult(answerResult);
    } catch {
      setSelectedIndex(null);
      setSubmitError("Could not submit your answer. Please try again.");
    }
  }

  function handleNext() {
    if (!result) {
      return;
    }

    if (isLastQuestion) {
      console.log("quiz finished");
      void confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#22c55e", "#f59e0b", "#ec4899"],
      });
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
    setResult(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRestart() {
    setFinished(false);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setResult(null);
    setSubmitError(null);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-blue-50 px-4">
        <p className="text-sm font-medium text-slate-600">Loading questions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-blue-50 px-4">
        <p className="max-w-[400px] rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-blue-50 px-4 py-6">
        <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600">
            Unofficial
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Quiz complete!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Results page coming soon.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Start Over
          </button>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-blue-50 px-4">
        <p className="text-center text-sm text-slate-600">No questions available.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50 px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[400px]">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600">
            Unofficial
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            AZ-900 Study Tool
          </h1>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <div className="mb-6">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {currentQuestion.topic}
          </span>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900">
            {currentQuestion.question}
          </h2>

          <div className="mt-5 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <QuizCard
                key={option}
                label={option}
                state={getCardState(index)}
                onClick={() => void handleAnswer(index)}
              />
            ))}
          </div>

          {submitError && (
            <p
              className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <div
            className={`grid transition-all duration-500 ease-out ${
              result ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            aria-live="polite"
          >
            <div className="overflow-hidden">
              {result && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {result.correct ? "Correct!" : "Not quite."}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {result.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {result && (
            <button
              type="button"
              onClick={handleNext}
              className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
