import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginationParams
} from '../models/api-response.model';
import {
  Factura,
  CreateFacturaRequest,
  UpdateFacturaRequest,
  FacturaFilters
} from '../../shared/models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private baseUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las facturas (con paginación y filtros opcionales)
   */
  getFacturas(
    pagination: PaginationParams,
    filters?: FacturaFilters
  ): Observable<ApiResponse<Factura[]>> {
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

    // FastAPI devuelve una lista simple, la adaptamos a ApiResponse
    return this.http.get<Factura[]>(this.baseUrl, { params }).pipe(
      map((facturas) => ({
        data: facturas,
        message: 'Facturas obtenidas correctamente',
        success: true,
        status: 200
      }))
    );
  }

  /**
   * Obtener una factura por su ID
   */
  getFacturaById(id: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear una nueva factura
   */
  createFactura(factura: CreateFacturaRequest): Observable<Factura> {
    return this.http.post<Factura>(this.baseUrl, factura);
  }

  /**
   * Actualizar una factura existente
   */
  updateFactura(id: string, factura: UpdateFacturaRequest): Observable<Factura> {
    return this.http.put<Factura>(`${this.baseUrl}/${id}`, factura);
  }

  /**
   * Eliminar una factura por su ID
   */
  deleteFactura(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map((res) => ({
        data: null,
        message: res.mensaje || 'Factura eliminada exitosamente',
        success: res.exito,
        status: 200
      }))
    );
  }

  /**
   * Obtener facturas por cita (endpoint auxiliar)
   */
  getFacturasPorCita(citaId: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.baseUrl}?cita_id=${citaId}`);
  }

  /**
   * Obtener facturas por rango de fechas (endpoint auxiliar)
   */
  getFacturasPorFecha(fechaDesde: string, fechaHasta: string): Observable<Factura[]> {
    const params = new HttpParams()
      .set('fecha_desde', fechaDesde)
      .set('fecha_hasta', fechaHasta);
    return this.http.get<Factura[]>(this.baseUrl, { params });
  }
}