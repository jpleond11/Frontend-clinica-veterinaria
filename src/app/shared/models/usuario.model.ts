/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id_usuario: string; // UUID
  primer_nombre_usuario: string;
  segundo_nombre_usuario?: string;
  primer_apellido_usuario: string;
  segundo_apellido_usuario?: string;
  rol_usuario: string;
  fecha_nacimiento_usuario: string; // ISO date string (YYYY-MM-DD)
  nombre_usuario: string;
  password?: string;
}

/**
 * Modelo para crear un nuevo usuario
 */
export interface CreateUsuarioRequest {
  primer_nombre_usuario: string;
  segundo_nombre_usuario?: string;
  primer_apellido_usuario: string;
  segundo_apellido_usuario?: string;
  rol_usuario: string;
  fecha_nacimiento_usuario: string;
  nombre_usuario: string;
  password: string;
}

/**
 * Modelo para actualizar un usuario existente
 */
export interface UpdateUsuarioRequest {
  primer_nombre_usuario?: string;
  segundo_nombre_usuario?: string;
  primer_apellido_usuario?: string;
  segundo_apellido_usuario?: string;
  rol_usuario?: string;
  fecha_nacimiento_usuario?: string;
  nombre_usuario?: string;
  password?: string;
}

/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  primer_nombre_usuario?: string;
  primer_apellido_usuario?: string;
  rol_usuario?: string;
  nombre_usuario?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}