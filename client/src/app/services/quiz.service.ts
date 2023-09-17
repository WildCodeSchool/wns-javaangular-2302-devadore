import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {QuizModel} from "../models/quiz.model";
import {CreateQuizModel} from "../models/create-quiz.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api/quiz';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getQuizs(): Observable<QuizModel[]> {
    const headers = new HttpHeaders().set('Authorization', 'Basic QWRtaW46YWRtaW4=');
    return this.http.get<QuizModel[]>(this.apiUrl, {headers});
  }

  getQuizById(id: number): Observable<QuizModel[]> {
    const headers = new HttpHeaders().set('Authorization', 'Basic QWRtaW46YWRtaW4=');
    return this.http.get<QuizModel[]>(`${this.apiUrl}/${id}`, {headers});
  }

  getRandomQuiz(): Observable<QuizModel> {
    return this.http.get<QuizModel>(this.apiUrl + '/random').pipe(
      map((res) => res
      ));
  }

  createQuiz(quiz: CreateQuizModel): Observable<CreateQuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken
      ? new HttpHeaders()
        .set('Authorization', `Bearer ${jwtToken}`)
        .set('Content-Type', 'application/json')
      : new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<CreateQuizModel[]>(`${this.apiUrl}`, quiz, {headers: headers});
  }


  updateQuiz(id: number, quiz: QuizModel): Observable<QuizModel[]> {
    return this.http.put<QuizModel[]>(`${this.apiUrl}/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<QuizModel[]> {
    return this.http.delete<QuizModel[]>(`${this.apiUrl}/${id}`);
  }
}

