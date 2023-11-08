import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnswerModel } from '../models/answer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private readonly apiUrl = environment.URL + '/api/answers';

  constructor(private http: HttpClient) {}

  getAnswers(): Observable<AnswerModel[]> {
    return this.http.get<AnswerModel[]>(this.apiUrl);
  }

  getAnswer(id: number): Observable<AnswerModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<AnswerModel>(url);
  }

  createAnswer(answer: AnswerModel): Observable<AnswerModel> {
    return this.http.post<AnswerModel>(this.apiUrl, answer);
  }

  updateAnswer(answer: AnswerModel): Observable<AnswerModel> {
    const url = `${this.apiUrl}/${answer.id}`;
    return this.http.put<AnswerModel>(url, answer);
  }

  deleteAnswer(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
