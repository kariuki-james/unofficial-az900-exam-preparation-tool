import { useState } from "react";

import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import type { ProgressData } from "./types";

export default function App() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  if (progress) {
    return (
      <ResultsPage
        progress={progress}
        onRetake={() => setProgress(null)}
      />
    );
  }

  return <QuizPage onComplete={(data) => setProgress(data)} />;
}
