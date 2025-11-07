import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';
import {
  Vacuna,
  CreateVacunaRequest,
  UpdateVacunaRequest,
  VacunaFilters
} from '../../shared/models/vacuna.model';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private readonly apiUrl = 'http://localhost:8000/vacunas';
  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las vacunas con paginación y filtros opcionales
   */
  getVacunas(
    pagination?: PaginationParams,
    filters?: VacunaFilters
  ): Observable<PaginatedResponse<Vacuna>> {
    let params = new HttpParams();

    if (pagination) {
      params = params
        .set('skip', ((pagination.page - 1) * pagination.limit).toString())
        .set('limit', pagination.limit.toString());
    }

    // Agregar filtros si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<Vacuna>>(this.apiUrl, { params });
  }

  /**
   * Obtener una vacuna por ID
   */
  getVacunaById(id_vacuna: string): Observable<ApiResponse<Vacuna>> {
    return this.http.get<ApiResponse<Vacuna>>(`${this.apiUrl}/${id_vacuna}`);
  }

  /**
   * Crear una nueva vacuna
   */
  createVacuna(vacuna: CreateVacunaRequest): Observable<ApiResponse<Vacuna>> {
    // Aquí podrías agregar usuario_id_creacion si lo manejas desde el frontend
    return this.http.post<ApiResponse<Vacuna>>(this.apiUrl, vacuna);
  }

  /**
   * Actualizar una vacuna existente
   */
  updateVacuna(
    id_vacuna: string,
    vacuna: UpdateVacunaRequest
  ): Observable<ApiResponse<Vacuna>> {
    return this.http.put<ApiResponse<Vacuna>>(
      `${this.apiUrl}/${id_vacuna}`,
      vacuna
    );
  }

  /**
   * Eliminar una vacuna
   */
  deleteVacuna(id_vacuna: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id_vacuna}`);
  }
}