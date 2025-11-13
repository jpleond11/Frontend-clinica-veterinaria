import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Veterinario, VeterinarioFilters } from '../../shared/models/veterinario.model';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private baseUrl = `${environment.apiUrl}/veterinarios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de veterinarios con soporte para filtros y paginación
   */
  getVeterinarios(
    pagination: PaginationParams,
    filters?: VeterinarioFilters
  ): Observable<PaginatedResponse<Veterinario>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }

    return this.http.get<Veterinario[]>(this.baseUrl, { params }).pipe(
      map((veterinarios) => {
        const total = veterinarios.length;
        const totalPages = Math.ceil(total / pagination.limit) || 1;

        const response: PaginatedResponse<Veterinario> = {
          data: veterinarios,
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages
        };
        return response;
      })
    );
  }

  /**
   * Obtener un veterinario por ID
   */
  getVeterinarioById(id: string): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear un nuevo veterinario
   */
  createVeterinario(veterinario: Partial<Veterinario>): Observable<ApiResponse<Veterinario>> {
    return this.http.post<Veterinario>(this.baseUrl, veterinario).pipe(
      map((data) => ({
        data,
        message: 'Veterinario creado exitosamente',
        success: true,
        status: 201
      }))
    );
  }

  /**
   * Actualizar un veterinario existente
   */
  updateVeterinario(id: string, veterinario: Partial<Veterinario>): Observable<ApiResponse<Veterinario>> {
    return this.http.put<Veterinario>(`${this.baseUrl}/${id}`, veterinario).pipe(
      map((data) => ({
        data,
        message: 'Veterinario actualizado exitosamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Eliminar un veterinario por ID
   */
  deleteVeterinario(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.baseUrl}/${id}`).pipe(
      map((res) => ({
        data: null,
        message: res.mensaje || 'Veterinario eliminado exitosamente',
        success: res.exito,
        status: 200
      }))
    );
  }
}