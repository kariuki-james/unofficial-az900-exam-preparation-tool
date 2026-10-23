import { useEffect, useState } from "react";

import AppHeader from "./components/AppHeader";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import type { ProgressData } from "./types";

const THEME_STORAGE_KEY = "az900-theme";

function getInitialDarkMode() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark") {
    return true;
  }

  if (storedTheme === "light") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 to-blue-50 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <AppHeader
        isDark={isDark}
        onToggleTheme={() => setIsDark((current) => !current)}
      />
      {progress ? (
        <ResultsPage
          progress={progress}
          onRetake={() => setProgress(null)}
        />
      ) : (
        <QuizPage onComplete={(data) => setProgress(data)} />
      )}
    </div>
  );
}
