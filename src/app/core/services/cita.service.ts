import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginationParams,
  PaginatedResponse
} from '../models/api-response.model';
import {
  Cita,
  CreateCitaRequest,
  UpdateCitaRequest,
  CitaFilters
} from '../../shared/models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las citas (con paginación y filtros opcionales)
   */
  getCitas(
    pagination: PaginationParams,
    filters?: CitaFilters
  ): Observable<ApiResponse<Cita[]>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    // FastAPI devuelve una lista simple, así que la adaptamos a ApiResponse
    return this.http.get<Cita[]>(this.baseUrl, { params }).pipe(
      map((citas) => ({
        data: citas,
        message: 'Citas obtenidas correctamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Obtener una cita por ID
   */
  getCitaById(id: string): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear una nueva cita
   */
  createCita(cita: CreateCitaRequest): Observable<Cita> {
    return this.http.post<Cita>(this.baseUrl, cita);
  }

  /**
   * Actualizar una cita existente
   */
  updateCita(id: string, cita: UpdateCitaRequest): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/${id}`, cita);
  }

  /**
   * Eliminar una cita
   */
  deleteCita(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map((res) => ({
        data: null,
        message: res.mensaje || 'Cita eliminada exitosamente',
        success: res.exito,
        status: 200
      }))
    );
  }

  /**
   * Obtener citas asociadas a un animal
   */
  getCitasPorAnimal(animalId: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}?animal_id=${animalId}`);
  }

  /**
   * Obtener citas asociadas a un veterinario
   */
  getCitasPorVeterinario(veterinarioId: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}?veterinario_id=${veterinarioId}`);
  }
}