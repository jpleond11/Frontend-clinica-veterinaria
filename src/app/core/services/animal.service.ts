import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Animal, AnimalFilters, CreateAnimalRequest, UpdateAnimalRequest } from '../../shared/models/animal.model';
import { PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private baseUrl = `${environment.apiUrl}/animales`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista paginada de animales con filtros opcionales
   */
  getAnimales(
    pagination: PaginationParams,
    filters?: AnimalFilters
  ): Observable<PaginatedResponse<Animal>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<Animal>>(this.baseUrl, { params });
  }

  /**
   * Crear un nuevo animal
   */
  createAnimal(data: CreateAnimalRequest | Partial<Animal>): Observable<Animal> {
    return this.http.post<Animal>(this.baseUrl, data);
  }

  /**
   * Actualizar un animal existente
   */
  updateAnimal(id: string | number, data: UpdateAnimalRequest | Partial<Animal>): Observable<Animal> {
    return this.http.put<Animal>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar un animal
   */
  deleteAnimal(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}