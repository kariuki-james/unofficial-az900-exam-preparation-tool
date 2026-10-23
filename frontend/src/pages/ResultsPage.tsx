import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

import ProgressRing from "../components/ProgressRing";
import TopicBar from "../components/TopicBar";
import type { ProgressData, Topic } from "../types";

const TOPICS: Topic[] = [
  "Cloud Concepts",
  "Azure Architecture and Services",
  "Azure Management and Governance",
];

interface ResultsPageProps {
  progress: ProgressData;
  onRetake: () => void;
}

export default function ResultsPage({ progress, onRetake }: ResultsPageProps) {
  const hasCelebrated = useRef(false);

  useEffect(() => {
    if (progress.total_answered === 0 || hasCelebrated.current) {
      return;
    }

    hasCelebrated.current = true;
    void confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#22c55e", "#f59e0b", "#ec4899"],
    });
  }, [progress.total_answered]);

  if (progress.total_answered === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Unofficial
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Your Results
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Your readiness will appear here after your first quiz 🚀
          </p>
          <button
            type="button"
            onClick={onRetake}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Take Quiz
          </button>
        </div>
      </main>
    );
  }

  const topicScores = TOPICS.map((topic) => ({
    topic,
    percentage: progress.topic_breakdown[topic],
  }));

  const lowestTopic = topicScores.reduce((lowest, current) =>
    current.percentage < lowest.percentage ? current : lowest,
  );

  return (
    <main className="flex flex-1 justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[400px]">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Unofficial
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Your Results
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            AZ-900 readiness snapshot
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 transition-colors duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="flex justify-center">
            <ProgressRing percentage={progress.percentage} />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Topic breakdown
            </h2>
            <div className="mt-4 space-y-5">
              {topicScores.map(({ topic, percentage }) => (
                <TopicBar key={topic} topic={topic} percentage={percentage} />
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              What to study next
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-blue-800 dark:text-blue-100">
              {`Focus on ${lowestTopic.topic} next — you scored ${Math.round(lowestTopic.percentage)}% there.`}
            </p>
          </div>

          <button
            type="button"
            onClick={onRetake}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Retake Quiz
          </button>
        </section>
      </div>
    </main>
  );
}
