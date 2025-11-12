import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginationParams
} from '../models/api-response.model';
import {
  Animal,
  AnimalFilters,
  CreateAnimalRequest,
  UpdateAnimalRequest
} from '../../shared/models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private baseUrl = `${environment.apiUrl}/animales`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los animales (con paginación y filtros opcionales)
   */
  getAnimales(
    pagination: PaginationParams,
    filters?: AnimalFilters
  ): Observable<ApiResponse<Animal[]>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    // Aplicar filtros opcionales si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    // Adaptamos la lista simple devuelta por FastAPI a ApiResponse
    return this.http.get<Animal[]>(this.baseUrl, { params }).pipe(
      map((animales) => ({
        data: animales,
        message: 'Animales obtenidos correctamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Obtener un animal por su ID
   */
  getAnimalById(id: string | number): Observable<Animal> {
    return this.http.get<Animal>(`${this.baseUrl}/${id}`);
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
  deleteAnimal(id: string | number): Observable<ApiResponse<null>> {
    return this.http
      .delete<{ mensaje: string; exito: boolean }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((res) => ({
          data: null,
          message: res.mensaje || 'Animal eliminado exitosamente',
          success: res.exito,
          status: 200
        }))
      );
  }
}