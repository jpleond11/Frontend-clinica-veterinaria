/**
 * Modelo para la entidad Propietario (Owner)
 */
export interface Propietario {
  id_propietario: string;
  primer_nombre_propietario: string;
  segundo_nombre_propietario: string | null; // Puede ser null
  primer_apellido_propietario: string;
  segundo_apellido_propietario: string;
  telefono: string;
  direccion: string;

  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id_creacion: string;
  usuario_id_edicion?: string | null; //Opcional, se usa al actualizar
}

/**
 * Modelo para crear un nuevo propietario
 */
export interface CreatePropietarioRequest {
  primer_nombre_propietario: string;
  segundo_nombre_propietario: string | null;
  primer_apellido_propietario: string;
  segundo_apellido_propietario: string;
  telefono: string;
  direccion: string;
  usuario_id_creacion: string;
}

/**
 * Modelo para actualizar un propietario
 */
export interface UpdatePropietarioRequest {
  primer_nombre_propietario?: string;
  segundo_nombre_propietario?: string | null;
  primer_apellido_propietario?: string;
  segundo_apellido_propietario?: string;
  telefono?: string;
  direccion?: string;
  usuario_id_edicion?: string | null;
}

/**
 * Modelo para filtros de propietarios
 */
export interface PropietarioFilters {
  nombre?: string; // Se usa para filtrar por primer_nombre o segundo_nombre
  apellido?: string; // Se usa para filtrar por primer_apellido o segundo_apellido
  telefono?: string;
}