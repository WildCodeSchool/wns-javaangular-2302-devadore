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

  getQuizzs(): Observable<QuizModel[]> {
    const headers = new HttpHeaders().set('Authorization', 'Basic QWRtaW46YWRtaW4=');
    return this.http.get<QuizModel[]>(this.apiUrl, {headers});
  }

  getQuizById(id: number): Observable<QuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    return this.http.get<QuizModel[]>(`${this.apiUrl}/show/${id}`, {headers});
  }

  getRandomQuiz(): Observable<QuizModel> {
    return this.http.get<QuizModel>(this.apiUrl + '/random').pipe(
      map((res) => res
      ));
  }

  getAllQuizzesCreatedByUser(userId: number): Observable<QuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    return this.http.get<QuizModel[]>(`${this.apiUrl}/${userId}`, {headers});
  }

  createQuiz(formData: FormData): Observable<CreateQuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};

    return this.http.post<CreateQuizModel[]>(`${this.apiUrl}`, formData, {headers: headers});
  }


  updateQuiz(id: number, formData: FormData): Observable<QuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    return this.http.put<QuizModel[]>(`${this.apiUrl}/${id}`, formData, {headers});
  }

  deleteQuiz(id: number): Observable<QuizModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    return this.http.delete<QuizModel[]>(`${this.apiUrl}/${id}`, {headers});
  }
}

