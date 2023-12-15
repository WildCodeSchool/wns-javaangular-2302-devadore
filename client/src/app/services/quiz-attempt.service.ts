import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { QuizAttempt } from '../models/quiz-attempt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {

  private apiUrl = environment.URL + '/api/quizAttempt';

  constructor(
    private http: HttpClient
  ) { }

  createQuizAttempt(quizAttempt: QuizAttempt) {
    return this.http.post<QuizAttempt>(this.apiUrl, quizAttempt);
  }

  getAllQuizAttemptByUserId(): Observable<QuizAttempt[]>{
    return this.http.get<QuizAttempt[]>(this.apiUrl);
  }
}
