import { useEffect, useState } from "react";

interface ProgressRingProps {
  percentage: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getRingColor(percentage: number) {
  if (percentage > 75) {
    return "text-green-500";
  }

  if (percentage >= 50) {
    return "text-amber-500";
  }

  return "text-red-500";
}

export default function ProgressRing({ percentage }: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedPercentage(clampedPercentage);
    });

    return () => cancelAnimationFrame(frame);
  }, [clampedPercentage]);

  const dashOffset =
    CIRCUMFERENCE - (animatedPercentage / 100) * CIRCUMFERENCE;

  return (
    <div
      className="relative h-48 w-48 sm:h-56 sm:w-56"
      role="img"
      aria-label={`${Math.round(clampedPercentage)}% ready`}
    >
      <svg className="h-full w-full" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          className="text-slate-100 dark:text-slate-800"
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
        />
        <circle
          className={`${getRingColor(clampedPercentage)} transition-all duration-1000 ease-out`}
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
          {Math.round(clampedPercentage)}%
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Ready
        </span>
      </div>
    </div>
  );
}
