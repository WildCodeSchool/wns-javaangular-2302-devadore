import {QuestionModel} from "./question.model";

export interface QuizModel {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  question: QuestionModel[];
  image?: string;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;

}
