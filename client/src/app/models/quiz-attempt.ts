import { QuizModel } from "./quiz.model";

export interface QuizAttempt {
    id?: number;
    userId?: number;
    quiz: QuizModel;
    scorePoints: number;
    correctAnswers: number;
    incorrectAnswers: number;
    startTime: Date;
    endTime?: Date;
    totalTimeSpent?: number;
}
