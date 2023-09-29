import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AnswerModel} from 'src/app/models/answer.model';
import {QuestionModel} from 'src/app/models/question.model';
import {QuestionService} from 'src/app/services/question.service';
import {Subject, Subscription, takeUntil, takeWhile, timer} from "rxjs";

@Component({
  selector: 'app-quiz-play',
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.scss']
})
export class QuizPlayComponent implements OnInit, OnDestroy {
  quizId: number;
  question?: QuestionModel;
  excludeIds: number[] = [];
  answers: AnswerModel[];
  selectedAnswer?: AnswerModel;
  isAnswered = false;
  score: number = 0;
  timeLeft: number = 10; // délai maximum pour répondre à une question
  maxTime: number = 10;
  timerSubscription?: Subscription;
  maxScorePerQuestion: number = 100; // score maximum par question
  private stopTimer$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getPageInfos();
  }

  startTimer(): void {
    this.timeLeft = this.maxTime;
    setTimeout(() => {
      this.timerSubscription = timer(0, 1000)
        .pipe(
          takeUntil(this.stopTimer$),
          takeWhile(() => this.timeLeft > 0)
        )
        .subscribe(() => {
          this.timeLeft--;
        });
    }, 1000);
  }


  getPageInfos(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;

    this.cdr.detectChanges();
    this.questionService.getRandomQuestionByQuizId(this.quizId, this.excludeIds).subscribe((res) => {
      if (res) {
        this.question = res;
        this.excludeIds.push(res.id);
        this.answers = this.question.answers;
        this.stopTimer$.next(); // Arrêtez le timer précédent avant de démarrer un nouveau
        console.log(this.question, this.excludeIds, this.answers);
        this.startTimer();
      }
    })
  }

  onAnswerSelected(answer: AnswerModel): void {
    this.stopTimer$.next();
    this.selectedAnswer = answer;
    this.isAnswered = true;
    console.log(this.excludeIds.length);

    if (answer.isCorrect) {
      if (this.maxTime - this.timeLeft < 2) { // si réponse en moins de 2 secondes
        this.score += this.maxScorePerQuestion; // score maximum
      } else {
        // déduire 10 points pour chaque seconde supplémentaire, avec un minimum de 10 points si reponse vrai mais tempps est écoulé
        this.score += Math.max(this.maxScorePerQuestion - (10 * (this.maxTime - this.timeLeft - 2)), 10);
      }
    }
  }

  getNextQuestion(): void {
    this.isAnswered = false;
    this.selectedAnswer = undefined;
    this.getPageInfos();
  }

  resetQuiz(): void {
    this.stopTimer$.next();
    this.score = 0;
    this.isAnswered = false;
    this.excludeIds = [];
    this.getPageInfos();
  }

  ngOnDestroy(): void {
    this.stopTimer$.next(); // stopper le timer lorsque le composant est détruit
    this.stopTimer$.complete(); // et complétez le Subject
  }

}
