import {Component, OnInit} from '@angular/core';
import {QuizModel} from 'src/app/models/quiz.model';
import {QuizService} from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.scss'],
})
export class QuizPreviewComponent implements OnInit {
  randomQuiz: QuizModel;
  quizId: number;

  constructor(private quizService: QuizService) {
  }

  ngOnInit(): void {
    this.getRandomQuiz();
  }

  getRandomQuiz(): void {
    this.quizService.getRandomQuiz().subscribe((res) => {
      this.randomQuiz = res;
      this.quizId = this.randomQuiz.id;
    });
  }
}
