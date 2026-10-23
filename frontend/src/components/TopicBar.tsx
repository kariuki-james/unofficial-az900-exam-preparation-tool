interface TopicBarProps {
  topic: string;
  percentage: number;
}

function getBarColors(percentage: number) {
  if (percentage > 75) {
    return {
      bar: "bg-green-500",
      text: "text-green-700 dark:text-green-400",
    };
  }

  if (percentage >= 50) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-400",
    };
  }

  return {
    bar: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
  };
}

export default function TopicBar({ topic, percentage }: TopicBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const colors = getBarColors(percentage);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {topic}
        </span>
        <span className={`text-sm font-semibold ${colors.text}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-label={`${topic} readiness`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
