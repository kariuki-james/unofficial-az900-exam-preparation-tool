import { useEffect, useState } from "react";

import QuizCard, { type QuizCardState } from "../components/QuizCard";
import { getProgress, getQuestions, submitAnswer } from "../services/api";
import type { AnswerResult, ProgressData, Question } from "../types";

interface QuizPageProps {
  onComplete: (progress: ProgressData) => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getQuestions()
      .then((data) => {
        if (!cancelled) {
          setQuestions(data);
          setCurrentIndex(0);
          setSelectedIndex(null);
          setResult(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchError(
            "We couldn't load the quiz. Please check that the backend is running, then try again.",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

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

  function handleRetryFetch() {
    setFetchError(null);
    setLoading(true);
    setRetryCount((count) => count + 1);
  }

  async function sendAnswer(index: number) {
    if (!currentQuestion) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const answerResult = await submitAnswer(currentQuestion.id, index);
      setResult(answerResult);
    } catch {
      setSubmitError("We couldn't check that answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnswer(index: number) {
    if (!currentQuestion || selectedIndex !== null || submitting) {
      return;
    }

    setSelectedIndex(index);
    await sendAnswer(index);
  }

  function handleRetrySubmit() {
    if (selectedIndex === null || submitting) {
      return;
    }

    void sendAnswer(selectedIndex);
  }

  async function handleNext() {
    if (!result || completing) {
      return;
    }

    if (isLastQuestion) {
      console.log("quiz finished");
      setCompleting(true);
      setCompleteError(null);

      try {
        const progress = await getProgress();
        onComplete(progress);
      } catch {
        setCompleting(false);
        setCompleteError("We couldn't load your results. Please try again.");
      }

      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
    setResult(null);
    setSubmitError(null);
    setCompleteError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-3" role="status">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading questions...
          </p>
        </div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] rounded-3xl border border-red-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 dark:border-red-900/60 dark:bg-slate-900 dark:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Could not load the quiz
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {fetchError}
          </p>
          <button
            type="button"
            onClick={handleRetryFetch}
            className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No questions are available right now.
          </p>
          <button
            type="button"
            onClick={handleRetryFetch}
            className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[400px]">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Unofficial
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            AZ-900 Study Tool
          </h1>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 transition-colors duration-300 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="mb-6">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {currentQuestion.topic}
          </span>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
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

          {submitting && (
            <div
              className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              role="status"
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
              Checking answer...
            </div>
          )}

          {submitError && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/40"
              role="alert"
            >
              <p className="text-sm text-red-700 dark:text-red-200">
                {submitError}
              </p>
              <button
                type="button"
                onClick={handleRetrySubmit}
                className="mt-2 text-sm font-semibold text-red-700 underline underline-offset-2 transition-colors hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
              >
                Try Again
              </button>
            </div>
          )}

          <div
            className={`grid transition-all duration-500 ease-out ${
              result ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            aria-live="polite"
          >
            <div className="overflow-hidden">
              {result && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p
                    className={`text-sm font-semibold ${
                      result.correct
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {result.correct ? "Correct!" : "Not quite."}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {result.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {result && (
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={completing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
            >
              {completing && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {completing
                ? "Loading results..."
                : isLastQuestion
                  ? "Finish Quiz"
                  : "Next Question"}
            </button>
          )}

          {completeError && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/40"
              role="alert"
            >
              <p className="text-sm text-red-700 dark:text-red-200">
                {completeError}
              </p>
              <button
                type="button"
                onClick={() => void handleNext()}
                className="mt-2 text-sm font-semibold text-red-700 underline underline-offset-2 transition-colors hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
              >
                Try Again
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
