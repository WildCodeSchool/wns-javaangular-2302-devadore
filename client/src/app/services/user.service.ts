import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';

import {User} from '../models/user.model';
import {AuthService} from "./auth.service";
import {Role} from "../models/role.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
  private regUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getUsers(): Observable<User[]> {
    const jwtToken = localStorage.getItem('jwtToken');
    console.log('Enregistrer le JWT récupéré', jwtToken);
    if (jwtToken) {
      console.log(`Bearer ${jwtToken}`);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
      return this.http.get<User[]>(`${this.baseUrl}/list`, {headers}).pipe(
        catchError((error) => {
          console.error(error);
          return of([]); // returning empty array as an error occurred
        })
      );

    } else {
      console.log('Pas de jeton JWT trouvé');
      return of([]); // returning empty array as no JWT token found
    }
  }

  getUserById(userId: number | null): Observable<User> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${userId}`;
    console.log('userId =', userId)
    return this.http.get<User>(url, {headers});
  }

  getUserIdByUsername(username: string): Observable<number> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/name/id?username=${encodeURIComponent(username)}`;
    return this.http.get<number>(url, {headers});
  }

  createUser(user: User): Observable<User> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};

    return this.http.post<User>(this.baseUrl, user, {headers});
  }

  updateUser(user: User): Observable<User> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${user.id}`;

    return this.http.put<User>(url, user, {headers});
  }

  deleteUser(userId: number): Observable<any> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${userId}`;

    return this.http.delete(url, {headers});
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.regUrl}/register`, formData);
  }

  updateUserImage(userId: number, imageFile: File, mimeType: string): Observable<User> {
    console.log('Image File:', imageFile);
    console.log('MIME Type:', mimeType);
    const formData = new FormData();
    formData.append('image', imageFile);

    const params = new HttpParams().set('mimeType', mimeType);

    const headers = new HttpHeaders();
    const jwtToken = this.authService.getToken();
    if (jwtToken) {
      headers.set('Authorization', `Bearer ${jwtToken}`);
    }

    return this.http.put<User>(`${this.baseUrl}/${userId}/image`, formData, {
      headers,
      params
    });
  }

  getUserImage(userId: number): Observable<any> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`).set('Content-Type', 'application/json') : new HttpHeaders().set('Content-Type', 'application/json');
    console.log('Request URL:', `${this.baseUrl}/${userId}/image`);
    console.log('Request Headers:', headers);
    return this.http.get<any>(`${this.baseUrl}/${userId}/image`, {headers, responseType: 'blob' as 'json'});
  }


  deleteUserImage(userId: number): Observable<any> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${userId}/image`;

    return this.http.delete(url, {headers});
  }
}
