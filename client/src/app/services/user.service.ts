import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { HeaderUtilService } from './header-util.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.URL + '/api/users';
  private regUrl = environment.URL + '/auth';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private headerUtil: HeaderUtilService
  ) {}

  getUsers(): Observable<User[]> {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${jwtToken}`
      );
      return this.http.get<User[]>(`${this.baseUrl}/list`, { headers }).pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  }

  getUserById(userId: number | null): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<User>(url, { headers: this.headerUtil.getHeaders() });
  }

  getUserIdByUsername(username: string): Observable<number> {
    const url = `${this.baseUrl}/name/id?username=${encodeURIComponent(
      username
    )}`;
    return this.http.get<number>(url, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.baseUrl}/${user.id}`;
    return this.http.put<User>(url, user, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.delete(url, { headers: this.headerUtil.getHeaders() });
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.regUrl}/register`, formData);
  }

  checkUsernameExistence(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.regUrl}/checkUsername`, {
      params: { username },
    });
  }

  checkMailExistence(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.regUrl}/checkMailExist`, {
      params: { email },
    });
  }

  updateUserImage(
    userId: number,
    imageFile: File,
    mimeType: string
  ): Observable<User> {
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
      params,
    });
  }

  getUserImage(userId: number): Observable<any> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken
      ? new HttpHeaders()
          .set('Authorization', `Bearer ${jwtToken}`)
          .set('Content-Type', 'application/json')
      : new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.baseUrl}/${userId}/image`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  deleteUserImage(userId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/image`;

    return this.http.delete(url, { headers: this.headerUtil.getHeaders() });
  }
}
