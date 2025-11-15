/**
 * Modelo para la entidad Veterinario
 */
export interface Veterinario {
  id_veterinario: string;
  primer_nombre_veterinario: string;
  segundo_nombre_veterinario: string | null; // Es opcional o puede ser null
  primer_apellido_veterinario: string;
  segundo_apellido_veterinario: string | null; // Es opcional o puede ser null
  telefono: string;
  email: string;
  especialidad: string;

  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id_creacion: string;
  usuario_id_edicion?: string | null; //Opcional, se usa al actualizar
}

/**
 * Modelo para crear un nuevo veterinario
 */
export interface CreateVeterinarioRequest {
  primer_nombre_veterinario: string;
  segundo_nombre_veterinario: string | null;
  primer_apellido_veterinario: string;
  segundo_apellido_veterinario: string | null;
  telefono: string;
  email: string;
  especialidad: string;
  usuario_id_creacion: string;
}

/**
 * Modelo para actualizar un veterinario
 */
export interface UpdateVeterinarioRequest {
  primer_nombre_veterinario?: string;
  segundo_nombre_veterinario?: string | null;
  primer_apellido_veterinario?: string;
  segundo_apellido_veterinario?: string | null;
  telefono?: string;
  email?: string;
  especialidad?: string;
  usuario_id_edicion: string | null;
}

/**
 * Modelo para filtros de veterinarios
 */
export interface VeterinarioFilters {
  id_veterinario?: string
  primer_nombre_veterinario?: string;
  segundo_nombre_veterinario?: string | null;
  primer_apellido_veterinario?: string;
  segundo_apellido_veterinario?: string | null;
  email?: string;
  especialidad?: string;
  telefono?: string;
}