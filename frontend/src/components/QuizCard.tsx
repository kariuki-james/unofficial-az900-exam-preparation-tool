export type QuizCardState = "idle" | "correct" | "wrong" | "dimmed";

interface QuizCardProps {
  label: string;
  state: QuizCardState;
  onClick: () => void;
}

const stateStyles: Record<QuizCardState, string> = {
  idle: "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-700",
  correct:
    "border-green-500 bg-green-100 text-green-900 dark:border-green-500 dark:bg-green-950 dark:text-green-100",
  wrong:
    "border-red-500 bg-red-100 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-100",
  dimmed:
    "border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500",
};

export default function QuizCard({ label, state, onClick }: QuizCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state !== "idle"}
      className={`w-full cursor-pointer rounded-2xl border-2 px-4 py-4 text-left text-sm font-medium shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-default dark:focus-visible:ring-offset-slate-900 ${stateStyles[state]}`}
    >
      {label}
    </button>
  );
}
