interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const DISCLAIMER =
  "⚠️ Unofficial study tool. Not affiliated with Microsoft. Questions are original and based on the public AZ-900 skills outline.";

export default function AppHeader({
  isDark,
  onToggleTheme,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50/95 backdrop-blur dark:border-amber-900/60 dark:bg-amber-950/95">
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-[11px] font-medium leading-snug text-amber-900 dark:text-amber-100">
          {DISCLAIMER}
        </p>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDark}
          className="shrink-0 self-end rounded-full border border-amber-300 bg-white/70 px-3 py-1 text-[11px] font-semibold text-amber-900 transition-all duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:border-amber-700 dark:bg-slate-900/70 dark:text-amber-100 dark:hover:bg-slate-900 sm:self-auto"
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </header>
  );
}
