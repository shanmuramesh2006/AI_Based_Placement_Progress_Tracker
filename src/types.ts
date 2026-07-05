export type Category = 'APTITUDE' | 'SQL' | 'CODING';

export interface DailyProgress {
  id: string;
  studentId: number;
  category: Category;
  score: number;
  logDate: string; // YYYY-MM-DD
}

export interface GeneratedTest {
  id: string;
  studentId: number;
  category: Category;
  questionsJson: string; // Original questions + correct answers
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: number;
  answersJson: string; // Student answers
  score: number;
  totalQuestions: number;
  correctCount: number;
  attemptedAt: string;
  feedbackJson: string; // Feedback breakdown per question
}

// Question structures (server-side internal)
export interface AptitudeQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface SQLQuestion {
  question: string;
  type: 'mcq' | 'query';
  options?: string[];
  correctAnswer: string; // Index as string for MCQ, SQL query or explanation for query
}

export interface CodingQuestion {
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

// Sanitized types for frontend
export interface SanitizedAptitudeQuestion {
  question: string;
  options: string[];
}

export interface SanitizedSQLQuestion {
  question: string;
  type: 'mcq' | 'query';
  options?: string[];
}

export interface SanitizedCodingQuestion {
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
}

export type SanitizedQuestion = SanitizedAptitudeQuestion | SanitizedSQLQuestion | SanitizedCodingQuestion;

export interface TestResponse {
  testId: string;
  category: Category;
  questions: SanitizedQuestion[];
}

export interface QuestionFeedback {
  question: string;
  type?: 'mcq' | 'query' | 'coding';
  studentAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SubmitResponse {
  score: number;
  correctCount: number;
  totalQuestions: number;
  feedback: QuestionFeedback[];
}
