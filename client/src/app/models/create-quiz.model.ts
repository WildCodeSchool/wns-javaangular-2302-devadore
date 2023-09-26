import {QuestionModel} from "./question.model";

export interface CreateQuizModel {
  title: string;
  description: string;
  questions: QuestionModel[];
  createdByUserId: number;
  image?: string;
  mimeType?: string;
}
