export type QuizCardState = "idle" | "correct" | "wrong" | "dimmed";

interface QuizCardProps {
  label: string;
  state: QuizCardState;
  onClick: () => void;
}

const stateStyles: Record<QuizCardState, string> = {
  idle: "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50",
  correct: "border-green-500 bg-green-100 text-green-900",
  wrong: "border-red-500 bg-red-100 text-red-900",
  dimmed: "border-slate-200 bg-slate-50 text-slate-400 opacity-60",
};

export default function QuizCard({ label, state, onClick }: QuizCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state !== "idle"}
      className={`w-full cursor-pointer rounded-2xl border-2 px-4 py-4 text-left text-sm font-medium shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-default ${stateStyles[state]}`}
    >
      {label}
    </button>
  );
}
