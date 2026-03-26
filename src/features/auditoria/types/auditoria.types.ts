export interface AuditoriaListItem {
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

export interface AuditoriaDetalle extends AuditoriaListItem {
  valores_anteriores: Record<string, unknown> | null;
  valores_nuevos: Record<string, unknown> | null;
  diferencias: Record<string, { anterior: unknown; nuevo: unknown }> | null;
  user_agent: string | null;
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

/* ── Filtros ── */

export interface AuditoriaFilters {
  usuario_id?: number | "";
  accion?: string;
  entidad_type?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}
