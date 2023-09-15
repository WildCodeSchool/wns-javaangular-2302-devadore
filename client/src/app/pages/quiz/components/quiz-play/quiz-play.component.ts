import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerModel } from 'src/app/models/answer.model';
import { QuestionModel } from 'src/app/models/question.model';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-quiz-play',
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.scss']
})
export class QuizPlayComponent implements OnInit {
  quizId: number;
  question?: QuestionModel;
  excludeIds: number[] = [];
  answers: AnswerModel[];
  selectedAnswer?: AnswerModel;
  isAnswered = false;
  score: number = 0;


  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
    ) {}

  ngOnInit(): void {
    this.getPageInfos();
  }

  getPageInfos(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
    
    this.questionService.getRandomQuestionByQuizId(this.quizId, this.excludeIds).subscribe((res) => {
      this.question = res;
      this.excludeIds.push(res.id);
      this.answers = this.question.answers 
      console.log(this.question, this.excludeIds, this.answers);
    })
  }

  onAnswerSelected(answer: AnswerModel): void {
    this.selectedAnswer = answer;
    this.isAnswered = true;
    console.log(this.excludeIds.length);

    if (answer.isCorrect) {
      this.score += 1;
    }
  }

  getNextQuestion(): void {
    this.isAnswered = false;
    this.selectedAnswer = undefined;
    this.getPageInfos(); 
  }

  resetQuiz(): void {
    this.score = 0;
    this.isAnswered = false;
    this.excludeIds = [];
    this.getPageInfos();
  }
  

}
