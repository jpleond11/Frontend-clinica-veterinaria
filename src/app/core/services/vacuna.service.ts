import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
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
  private baseUrl = `${environment.apiUrl}/vacunas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las vacunas (con paginación y filtros opcionales)
   */
  getVacunas(
    pagination: PaginationParams,
    filters?: VacunaFilters
  ): Observable<ApiResponse<Vacuna[]>> {
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

    // Si la API devuelve una lista simple, la adaptamos a ApiResponse
    return this.http.get<Vacuna[]>(this.baseUrl, { params }).pipe(
      map((vacunas) => ({
        data: vacunas,
        message: 'Vacunas obtenidas correctamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Obtener una vacuna por su ID
   */
  getVacunaById(id: string): Observable<Vacuna> {
    return this.http.get<Vacuna>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear una nueva vacuna
   */
  createVacuna(vacuna: CreateVacunaRequest): Observable<Vacuna> {
    return this.http.post<Vacuna>(this.baseUrl, vacuna);
  }

  /**
   * Actualizar una vacuna existente
   */
  updateVacuna(id: string, vacuna: UpdateVacunaRequest): Observable<Vacuna> {
    return this.http.put<Vacuna>(`${this.baseUrl}/${id}`, vacuna);
  }

  /**
   * Eliminar una vacuna por su ID
   */
  deleteVacuna(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<{ mensaje: string; exito: boolean }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((res) => ({
          data: null,
          message: res.mensaje || 'Vacuna eliminada exitosamente',
          success: res.exito,
          status: 200
        }))
      );
  }
}
