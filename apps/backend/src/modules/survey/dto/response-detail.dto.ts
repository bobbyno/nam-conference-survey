export class QuestionDetailDto {
  questionNumber!: number;
  questionText!: string;
  questionType!: 'likert' | 'likert-with-na' | 'multiselect' | 'ranking' | 'openended' | 'single-choice' | 'text-field';
  answer: any;
}

export class ResponseDetailDto {
  id!: string;
  submittedAt!: Date;
  questions!: QuestionDetailDto[];

  constructor(id: string, submittedAt: Date, questions: QuestionDetailDto[]) {
    this.id = id;
    this.submittedAt = submittedAt;
    this.questions = questions;
  }
}
