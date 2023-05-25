import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, throwError} from "rxjs";
import {Role} from "../models/role.model";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl= 'http://localhost:8080/api/users/roles';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRoles(): Observable<Role[]> {
    const jwtToken = localStorage.getItem('jwtToken');
    console.log('Enregistrer le JWT récupéré',jwtToken);
    if (jwtToken) {
      console.log(`Bearer ${jwtToken}`);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
      return this.http.get<Role[]>(`${this.baseUrl}`, { headers });

    } else {
      console.log('Pas de jeton JWT trouvé');
      return throwError('Pas de jeton JWT trouvé');
    }
  }
  getRoleById(roleId: number): Observable<Role> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${roleId}`;

    return this.http.get<Role>(url, { headers });
  }

  createRole(roles: Role): Observable<Role> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};

    return this.http.post<Role>(this.baseUrl, roles, { headers });
  }

  updateRole(roles: Role): Observable<Role> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${roles.id}`;

    return this.http.put<Role>(url, roles, { headers });
  }

  deleteRole(roleId: number): Observable<any> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : {};
    const url = `${this.baseUrl}/${roleId}`;

    return this.http.delete(url, { headers });
  }
}
