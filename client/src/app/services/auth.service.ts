import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  roles: string[] = [];
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  authenticateUser(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password
    };

    return this.http.post<any>(`${this.apiUrl}/authenticate`, loginData).pipe(
      tap((response) => {
        console.log('authservice:',response)
        const token = response.token;
        const roles = response.roles;
        this.saveToken(token);
        this.saveRoles(roles);
      })
    );
  }
  setAuthenticationState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  setAdminState(isAdmin: boolean): void {
    this.isAdminSubject.next(isAdmin);
  }
  private saveRoles(roles: string[]): void {
    this.roles = roles;
  }
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  decodeToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/logout`, {}, { headers: headers })
        .pipe(
          tap(() => {
            console.log('Removing tokens...');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/home']);
          })
        );
    }
    throw new Error("User is not logged in");
  }

}


