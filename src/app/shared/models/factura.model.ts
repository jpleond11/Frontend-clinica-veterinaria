/**
 * Modelo para la entidad Factura
 */
export interface Factura {
  id_factura: string;
  monto_factura: number;
  descripcion_factura: string;
  fecha_emision: string; // Puede ser un string en formato ISO o Date, dependiendo de tu backend
  cita_id: string;

  // Propiedad de relación (opcional, para incluir la información de la cita)
  cita?: {
    id_cita: string;
    fecha_inicio_cita: string;
    // Puedes incluir más campos relevantes de Cita aquí
    motivo_cita: string;
    animal?: {
      id_animal: string;
      nombre_animal: string;
    };
  };

  fecha_creacion: string;
  fecha_actualizacion: string;
}

/**
 * Modelo para crear una nueva factura
 */
export interface CreateFacturaRequest {
  monto_factura: number;
  descripcion_factura: string;
  fecha_emision?: string; // Podría ser opcional si el backend la genera
  cita_id: string;
}

/**
 * Modelo para actualizar una factura
 */
export interface UpdateFacturaRequest {
  monto_factura?: number;
  descripcion_factura?: string;
  fecha_emision?: string;
  cita_id?: string;
}

/**
 * Modelo para filtros de facturas
 */
export interface FacturaFilters {
  monto_factura_min?: number;
  monto_factura_max?: number;
  descripcion_factura?: string;
  cita_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}