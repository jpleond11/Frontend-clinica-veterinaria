import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioFilters } from '../../shared/models/usuario.model';
import {
  ApiResponse,
  PaginationParams
} from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de usuarios con soporte para filtros y paginación
   */
  getUsuarios(
    pagination: PaginationParams,
    filters?: UsuarioFilters
  ): Observable<ApiResponse<Usuario[]>> {
    let params = new HttpParams()
      .set('skip', ((pagination.page - 1) * pagination.limit).toString())
      .set('limit', pagination.limit.toString());

    // Por si se agregan más filtros en la API
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }

    return this.http.get<Usuario[]>(this.baseUrl, { params }).pipe(
          map((usuarios) => ({
            data: usuarios,
            message: 'Usuarios obtenidos correctamente',
            success: true,
            status: 200
          }))
        );
      }

  /**
   * Obtener un usuario por ID
   */
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear un nuevo usuario
   */
  createUsuario(usuario: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.post<Usuario>(this.baseUrl, usuario).pipe(
      map((data) => ({
        data,
        message: 'Usuario creado exitosamente',
        success: true,
        status: 201
      }))
    );
  }

  /**
   * Actualizar un usuario existente
   */
  updateUsuario(
    id: string,
    usuario: Partial<Usuario>
  ): Observable<ApiResponse<Usuario>> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario).pipe(
      map((data) => ({
        data,
        message: 'Usuario actualizado exitosamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Eliminar un usuario por ID
   */
  deleteUsuario(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map((res) => ({
        data: null,
        message: res.mensaje || 'Usuario eliminado exitosamente',
        success: res.exito,
        status: 200
      }))
    );
  }
}