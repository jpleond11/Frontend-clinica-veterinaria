/**
 * Modelo para la entidad Animal
 */
export interface Animal {
  id_animal: string;
  nombre_animal: string;
  especie_animal: string;
  fecha_nacimiento_animal: string;
  propietario_id: string;
  categoria_id: string;
  propietario?: {
    id_propietario: string;
    nombre_completo: string;
  };
  categoria?: {
    id_categoria: string;
    nombre_categoria: string;
  };
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario_id_creacion: string;
  usuario_id_edicion?: string | null; //Opcional, se usa al actualizar
}

/**
 * Modelo para crear un nuevo animal
 */
export interface CreateAnimalRequest {
  nombre_animal: string;
  especie_animal: string;
  fecha_nacimiento_animal: string;
  propietario_id: string;
  categoria_id: string;
  usuario_id_creacion: string;
}

/**
 * Modelo para actualizar un animal
 */
export interface UpdateAnimalRequest {
  nombre_animal?: string;
  especie_animal?: string;
  fecha_nacimiento_animal?: string;
  propietario_id?: string;
  categoria_id?: string;
  usuario_id_edicion?: string | null;
}

/**
 * Modelo para filtros de animales
 */
export interface AnimalFilters {
  nombre_animal?: string;
  especie_animal?: string;
  propietario_id?: string;
  categoria_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}