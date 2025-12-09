export interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctOptionIndex?: number;
}

export interface Quiz {
  _id: string;
  module_id: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
}

export interface QuizAttemptResult {
  message: string;
  score: number;
  totalQuestions: number;
  percentage: string;
  attempt?: any;
  passed?: boolean;
}
export interface QuizCreatePayload {
  module_id: string;
  questions: QuizQuestion[];
}

export interface QuizUpdatePayload {
  questions?: QuizQuestion[];
}
export interface QuizDeletePayload {
  quiz_id: string;
}
