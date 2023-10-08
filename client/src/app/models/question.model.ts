import {AnswerModel} from "./answer.model";

export interface QuestionModel {
  id: number;
  type: string;
  text: string;
  image: string;
  answers: AnswerModel[];
  timer: number;
  isMultipleChoice: boolean;
  isAnswered: boolean;
}
