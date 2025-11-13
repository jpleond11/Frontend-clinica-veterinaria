import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginationParams
} from '../models/api-response.model';
import {
  Propietario,
  CreatePropietarioRequest,
  UpdatePropietarioRequest,
  PropietarioFilters
} from '../../shared/models/propietario.model';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  private baseUrl = `${environment.apiUrl}/propietarios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de propietarios con paginación y filtros
   */
  getPropietarios(
    pagination: PaginationParams,
    filters?: PropietarioFilters
  ): Observable<ApiResponse<Propietario[]>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    // Añadir filtros si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    // FastAPI devuelve una lista simple → la adaptamos al ApiResponse
    return this.http.get<Propietario[]>(this.baseUrl, { params }).pipe(
      map((propietarios) => ({
        data: propietarios,
        message: 'Propietarios obtenidos correctamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Obtener un propietario por ID
   */
  getPropietarioById(id: string): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear un nuevo propietario
   */
  createPropietario(data: CreatePropietarioRequest): Observable<Propietario> {
    return this.http.post<Propietario>(this.baseUrl, data);
  }

  /**
   * Actualizar un propietario existente
   */
  updatePropietario(id: string, data: UpdatePropietarioRequest): Observable<Propietario> {
    return this.http.put<Propietario>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar un propietario por ID
   */
  deletePropietario(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<{ mensaje: string; exito: boolean }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((res) => ({
          data: null,
          message: res.mensaje || 'Propietario eliminado exitosamente',
          success: res.exito,
          status: 200
        }))
      );
  }

  /**
   * Buscar propietarios por nombre (opcional)
   */
  searchByNombre(nombre: string): Observable<Propietario[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Propietario[]>(this.baseUrl, { params });
  }

  /**
   * Buscar propietarios por apellido (opcional)
   */
  searchByApellido(apellido: string): Observable<Propietario[]> {
    const params = new HttpParams().set('apellido', apellido);
    return this.http.get<Propietario[]>(this.baseUrl, { params });
  }
}