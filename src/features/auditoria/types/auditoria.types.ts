export interface AuditoriaUsuarioRef {
  id: number;
  nombre: string;
  email: string;
  username?: string;
}

export interface AuditoriaListItem {
  id: number;
  usuario: AuditoriaUsuarioRef;
  accion: string;
  accion_texto: string;
  entidad_type: string;
  entidad_nombre: string;
  entidad_id: number;
  ip: string | null;
  created_at: string;
  created_at_humano: string;
  fecha: string;
}

export interface AuditoriaDetalle {
  id: number;
  usuario: AuditoriaUsuarioRef;
  accion: string;
  entidad_type: string;
  entidad_nombre: string;
  entidad_id: number;
  valores_anteriores: Record<string, unknown> | null;
  valores_nuevos: Record<string, unknown> | null;
  diferencias: Record<string, { anterior: unknown; nuevo: unknown }> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  created_at_humano: string;
  fecha_completa: string;
}

export interface AccionAuditoria {
  value: string;
}

export interface EntidadAuditoria {
  value: string;
  label: string;
}



export interface ExportAuditoriaItem {
  id: number;
  fecha: string;
  usuario: string;
  email: string;
  accion: string;
  entidad: string;
  entidad_id: number;
  ip: string | null;
  cambios: string;
}

export interface AuditoriaExportData {
  total: number;
  fecha_exportacion: string;
  data: ExportAuditoriaItem[];
}

export interface AuditoriaFilters {
  usuario_id?: number | "";
  accion?: string;
  entidad_type?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export type AuditoriaViewMode = "timeline" | "table";
