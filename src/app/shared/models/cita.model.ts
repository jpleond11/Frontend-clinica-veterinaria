/**
 * Modelo para la entidad Cita
 */
export interface Cita {
  id_cita: string;
  fecha_inicio_cita: string;
  fecha_final_cita: string;
  motivo_cita: string;
  animal_id: string;
  vacuna_id?: string;
  veterinario_id: string;

  animal?: {
    id_animal: string;
    nombre_animal: string;
    especie_animal: string;
  };
  vacuna?: {
    id_vacuna: string;
    nombre_vacuna: string;
  };
  veterinario?: {
    id_veterinario: string;
    primer_nombre_veterinario: string;
    primer_apellido_veterinario: string;
  };

  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id_creacion: string;
  usuario_id_edicion?: string | null; //Opcional, se usa al actualizar
}

/**
 * Modelo para crear una nueva cita
 */
export interface CreateCitaRequest {
  fecha_inicio_cita: string;
  fecha_final_cita: string;
  motivo_cita: string;
  animal_id: string;
  vacuna_id?: string;
  veterinario_id: string;
  usuario_id_creacion: string;
}

/**
 * Modelo para actualizar una cita
 */
export interface UpdateCitaRequest {
  fecha_inicio_cita?: string;
  fecha_final_cita?: string;
  motivo_cita?: string;
  animal_id?: string;
  vacuna_id?: string;
  veterinario_id?: string;
  usuario_id_edicion?: string | null;
}

/**
 * Modelo para filtros de citas
 */
export interface CitaFilters {
  motivo_cita?: string;
  animal_id?: string;
  vacuna_id?: string;
  veterinario_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}