import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QuizModel } from '../models/quiz.model';
import { CreateQuizModel } from '../models/create-quiz.model';
import { HeaderUtilService } from './header-util.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = environment.URL + '/api/quiz';

  constructor(
    private http: HttpClient,
    private headerUtil: HeaderUtilService
  ) {}

  getQuizzs(): Observable<QuizModel[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Basic QWRtaW46YWRtaW4='
    );
    return this.http.get<QuizModel[]>(this.apiUrl, { headers });
  }

  getQuizById(id: number): Observable<QuizModel> {
    return this.http.get<QuizModel>(`${this.apiUrl}/show/${id}`, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  getRandomQuiz(): Observable<QuizModel> {
    return this.http
      .get<QuizModel>(this.apiUrl + '/random')
      .pipe(map((res) => res));
  }

  getRandomQuizByCat(id: number): Observable<QuizModel> {
    return this.http
      .get<QuizModel>(`${this.apiUrl}/random/category/${id}`)
      .pipe(map((res) => res));
  }

  getTotalQuestionsForQuiz(quizId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${quizId}/totalQuestions`);
  }

  getAllQuizzesCreatedByUser(userId: number): Observable<QuizModel[]> {
    return this.http.get<QuizModel[]>(`${this.apiUrl}/${userId}`, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  createQuiz(formData: FormData): Observable<CreateQuizModel[]> {
    return this.http.post<CreateQuizModel[]>(`${this.apiUrl}`, formData, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  updateQuiz(id: number, formData: FormData): Observable<QuizModel[]> {
    return this.http.put<QuizModel[]>(`${this.apiUrl}/${id}`, formData, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  deleteQuiz(id: number): Observable<QuizModel[]> {
    return this.http.delete<QuizModel[]>(`${this.apiUrl}/${id}`, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  canUserEditQuiz(quizId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${quizId}/can-edit`, {
      headers: this.headerUtil.getHeaders(),
    });
  }
}
