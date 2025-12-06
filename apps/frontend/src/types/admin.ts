export interface AdminMetricsResponse {
  completed: number;
  inProgress: number;
}

export interface RecentResponseItem {
  id: string;
  submittedAt: string; // ISO 8601 timestamp
}

export interface AdminRecentResponsesResponse {
  responses: RecentResponseItem[];
}

export interface QuestionDetail {
  questionNumber: number;
  questionText: string;
  questionType: 'likert' | 'likert-with-na' | 'multiselect' | 'ranking' | 'openended' | 'single-choice' | 'text-field';
  answer: any;
}

export interface ResponseDetail {
  id: string;
  submittedAt: string;
  questions: QuestionDetail[];
}
