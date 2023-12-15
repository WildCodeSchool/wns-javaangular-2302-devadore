import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QuizAttempt } from 'src/app/models/quiz-attempt';
import { QuizAttemptService } from 'src/app/services/quiz-attempt.service';

@Component({
  selector: 'app-quiz-history',
  templateUrl: './quiz-history.component.html',
  styleUrls: ['./quiz-history.component.scss'],
})
export class QuizHistoryComponent implements OnInit {

  quizAttempts: QuizAttempt[];
  userId: number | undefined;

  dataSource = new MatTableDataSource<QuizAttempt>;
  displayedColumns: string[] = ['title', 'scorePoints', 'correctAnswers', 'incorrectAnswers', 'startTime'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private quizAttemptService: QuizAttemptService) {}

  ngOnInit(): void {
    this.quizAttemptService.getAllQuizAttemptByUserId().subscribe((res) => {
      this.quizAttempts = res;
      this.userId = this.quizAttempts[0].userId;
      
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'title': return item.quiz.title;
          default: return (item as any)[property];
        }
      };
      this.dataSource.sort = this.sort;
    });
  }
}
