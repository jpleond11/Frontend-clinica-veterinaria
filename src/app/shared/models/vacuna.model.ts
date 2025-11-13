/**
 * Modelo para la entidad Vacuna
 */
export interface Vacuna {
  id_vacuna: string;
  nombre_vacuna: string;
  fecha_aplicacion_vacuna: string; // Fecha en formato ISO string
  proxima_dosis_vacuna: string | null; // Fecha en formato ISO string o null

  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id_creacion: string;
  usuario_id_edicion?: string | null; //Opcional, se usa al actualizar
}

/**
 * Modelo para crear una nueva vacuna
 */
export interface CreateVacunaRequest {
  nombre_vacuna: string;
  fecha_aplicacion_vacuna: string;
  proxima_dosis_vacuna: string | null;
  usuario_id_creacion: string;
}

/**
 * Modelo para actualizar una vacuna
 */
export interface UpdateVacunaRequest {
  nombre_vacuna?: string;
  fecha_aplicacion_vacuna?: string;
  proxima_dosis_vacuna?: string | null;
  usuario_id_edicion?: string | null;
}

/**
 * Modelo para filtros de vacunas
 */
export interface VacunaFilters {
  nombre_vacuna?: string;
  fecha_aplicacion_vacuna?: string;
  fecha_aplicacion_desde?: string;
  fecha_aplicacion_hasta?: string;
  proxima_dosis_desde?: string;
  proxima_dosis_hasta?: string;
}