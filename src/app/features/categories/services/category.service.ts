/**
 * Servicio de Categorías
 * Sistema de Gestión Comercial
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../core/services/http.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryProductsResponse
} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = '/categories';

  constructor(private http: HttpService) {}

  /**
   * Obtener todas las categorías en estructura jerárquica
   * @param status Estado: 'active' | 'inactive' | 'all'
   */
  getAllCategories(status: 'active' | 'inactive' | 'all' = 'active'): Observable<Category[]> {
    return this.http.get<any>(`${this.endpoint}?status=${status}`)
      .pipe(
        map(response => response.data as Category[])
      );
  }

  /**
   * Obtener una categoría por ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<any>(`${this.endpoint}/${id}`)
      .pipe(
        map(response => response.data as Category)
      );
  }

  /**
   * Crear una nueva categoría
   */
  createCategory(data: CreateCategoryDto): Observable<Category> {
    return this.http.post<any>(this.endpoint, data)
      .pipe(
        map(response => response.data as Category)
      );
  }

  /**
   * Actualizar una categoría existente
   */
  updateCategory(id: number, data: UpdateCategoryDto): Observable<Category> {
    return this.http.put<any>(`${this.endpoint}/${id}`, data)
      .pipe(
        map(response => response.data as Category)
      );
  }

  /**
   * Cambiar estado de una categoría (activar/desactivar)
   */
  toggleCategoryStatus(id: number, isActive: boolean): Observable<Category> {
    return this.http.patch<any>(`${this.endpoint}/${id}/status`, { isActive })
      .pipe(
        map(response => response.data as Category)
      );
  }

  /**
   * Eliminar una categoría
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<any>(`${this.endpoint}/${id}`)
      .pipe(
        map(() => void 0)
      );
  }

  /**
   * Obtener productos de una categoría
   */
  getProductsByCategory(id: number): Observable<CategoryProductsResponse> {
    return this.http.get<any>(`${this.endpoint}/${id}/products`)
      .pipe(
        map(response => response.data as CategoryProductsResponse)
      );
  }

  /**
   * Health check del módulo
   */
  healthCheck(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/health`);
  }
}
