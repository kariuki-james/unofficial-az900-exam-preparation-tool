export type Topic =
  | "Cloud Concepts"
  | "Azure Architecture and Services"
  | "Azure Management and Governance";

export interface Question {
  id: number;
  topic: Topic;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface AnswerResult {
  correct: boolean;
  explanation: string;
  correct_index: number;
}

export interface ProgressData {
  total_answered: number;
  correct_count: number;
  percentage: number;
  topic_breakdown: Record<Topic, number>;
}
