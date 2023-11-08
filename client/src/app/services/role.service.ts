import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Role } from '../models/role.model';
import { HeaderUtilService } from './header-util.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.URL + '/api/users/roles';

  constructor(
    private http: HttpClient,
    private headerUtil: HeaderUtilService
  ) {}

  getRoles(): Observable<Role[]> {
    const jwtToken = localStorage.getItem('jwtToken');
    console.log('Enregistrer le JWT récupéré', jwtToken);
    if (jwtToken) {
      console.log(`Bearer ${jwtToken}`);
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${jwtToken}`
      );
      return this.http.get<Role[]>(`${this.baseUrl}`, { headers });
    } else {
      console.log('Pas de jeton JWT trouvé');
      return throwError('Pas de jeton JWT trouvé');
    }
  }

  getRoleById(roleId: number): Observable<Role> {
    const url = `${this.baseUrl}/${roleId}`;

    return this.http.get<Role>(url, { headers: this.headerUtil.getHeaders() });
  }

  createRole(roles: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, roles, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  updateRole(roles: Role): Observable<Role> {
    const url = `${this.baseUrl}/${roles.id}`;
    return this.http.put<Role>(url, roles, {
      headers: this.headerUtil.getHeaders(),
    });
  }

  deleteRole(roleId: number): Observable<any> {
    const url = `${this.baseUrl}/${roleId}`;
    return this.http.delete(url, { headers: this.headerUtil.getHeaders() });
  }
}
