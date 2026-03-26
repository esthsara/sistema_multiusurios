// src/features/personas/types/persona-detalle.types.ts

export type TipoContacto =
  | "EMAIL"
  | "TELEFONO"
  | "OTRO";

export type TipoDomicilio =
  | "FISCAL"
  | "PARTICULAR"
  | "ENTREGA"
  | "OTRO";

export type TipoArchivo = "CI" | "CONTRATO" | "CERTIFICADO" | "FOTO" | "OTRO";

/* ── Contacto ── */
export interface Contacto {
  id: number;
  tipo: TipoContacto;
  tipo_texto: string;
  valor: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactoDto {
  persona_id: number;
  tipo: TipoContacto;
  valor: string;
}

export interface UpdateContactoDto {
  tipo: TipoContacto;
  valor: string;
}

/* ── Domicilio ── */
export interface Domicilio {
  id: number;
  tipo: TipoDomicilio;
  tipo_texto: string;
  pais: string;
  ciudad: string;
  direccion: string;
  codigo_postal: string | null;
  principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDomicilioDto {
  persona_id: number;
  tipo: TipoDomicilio;
  direccion: string;
  ciudad: string;
  pais: string;
  codigo_postal?: string;
  principal?: boolean;
}

export type UpdateDomicilioDto = Partial<
  Omit<CreateDomicilioDto, "persona_id">
>;

/* ── Archivo ── */
export interface Archivo {
  id: number;
  nombre: string;
  ruta: string;
  url: string;
  tipo: TipoArchivo;
  tipo_texto: string;
  fecha_expiracion: string | null;
  created_at: string;
}

/* ── Auditoría ── */
export interface AuditoriaItem {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
  accion: string;
  accion_texto: string;
  entidad_type: string;
  entidad_nombre: string;
  entidad_id: number;
  ip: string;
  created_at: string;
  created_at_humano: string;
  fecha: string;
}
