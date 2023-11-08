import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment + '/api/categories';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCategories(): Observable<CategoryModel[]> {
    const jwtToken = this.authService.getToken();
    const headers = jwtToken
      ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`)
      : {};
    return this.http.get<CategoryModel[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<CategoryModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CategoryModel>(url);
  }

  createCategory(categorie: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(this.apiUrl, categorie);
  }

  updateCategory(categorie: CategoryModel): Observable<CategoryModel> {
    const url = `${this.apiUrl}/${categorie.id}`;
    return this.http.put<CategoryModel>(url, categorie);
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
