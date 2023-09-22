import {QuestionModel} from "./question.model";

export interface QuizModel {
  id: number;
  title: string;
  description: string;
  question: QuestionModel[];
  image?: string;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;

}
