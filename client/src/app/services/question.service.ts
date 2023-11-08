import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionModel } from '../models/question.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly apiUrl = environment.URL + '/api/questions';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<QuestionModel[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Basic QWRtaW46YWRtaW4='
    );
    return this.http.get<QuestionModel[]>(this.apiUrl, { headers });
  }

  getQuestion(id: number): Observable<QuestionModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<QuestionModel>(url);
  }

  getRandomQuestionByQuizId(
    id: number,
    excludeIds: number[]
  ): Observable<QuestionModel> {
    const params = new HttpParams().set('excludeIds', excludeIds.join(','));
    return this.http.get<QuestionModel>(
      environment.URL + `/api/question/random/quiz/${id}`,
      { params }
    );
  }

  createQuestion(question: QuestionModel): Observable<QuestionModel> {
    return this.http.post<QuestionModel>(this.apiUrl, question);
  }

  updateQuestion(question: QuestionModel): Observable<QuestionModel> {
    const url = `${this.apiUrl}/${question.id}`;
    return this.http.put<QuestionModel>(url, question);
  }

  deleteQuestion(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
