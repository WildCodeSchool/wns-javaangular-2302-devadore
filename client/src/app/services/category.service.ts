import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { environment } from 'src/environments/environment';
import { HeaderUtilService } from './header-util.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.URL + '/api/categories';

  constructor(
    private http: HttpClient,
    private headerUtil: HeaderUtilService
  ) {}

  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}`, {
      headers: this.headerUtil.getHeaders(),
    });
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
