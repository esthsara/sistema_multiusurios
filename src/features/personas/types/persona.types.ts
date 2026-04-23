// src/features/personas/types/persona.types.ts
import type { TipoPersona, EstadoPersona } from "@/shared/types/auth.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESPUESTAS DEL BACKEND */

export interface PersonaListItem {
  id: number;
  foto: string | null;
  nombre: string | null;
  apellido: string | null;
  razon_social: string | null;
  nombre_completo: string | null;
  display_name: string;
  identificacion_principal: string;
  tipo_persona: TipoPersona;
  tipo_texto: string;
  estado: EstadoPersona;
  estado_texto: string;
  estado_color: string;
  fecha_registro: string;
  fecha_registro_humano: string;
  usuario_asociado: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PersonaDetalle extends PersonaListItem {
  fecha_nacimiento: string | null;
  genero: string | null;
  foto_path: string | null;
  created_at: string;
  updated_at: string;
  usuario: unknown | null;
  contactos: unknown[];
  domicilios: unknown[];
  archivos: unknown[];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs — Lo que enviamos */

export interface CreatePersonaFisicaDto {
  tipo_persona: "FISICA";
  nombre: string;
  apellido: string;
  identificacion_principal: string;
  fecha_nacimiento?: string;
  genero?: "M" | "F" | "Otro";
}

export interface CreatePersonaMoralDto {
  tipo_persona: "MORAL";
  razon_social: string;
  identificacion_principal: string;
}

export type CreatePersonaDto = CreatePersonaFisicaDto | CreatePersonaMoralDto;

export type UpdatePersonaDto = Partial<
  Omit<CreatePersonaFisicaDto, "tipo_persona"> &
    Omit<CreatePersonaMoralDto, "tipo_persona">
>;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS DE TABLA */

export interface PersonaFilters {
  tipo_persona?: TipoPersona | "";
  estado?: EstadoPersona | "";
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface PersonaQueryParams extends PersonaFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  [key: string]: any;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ESTADOS DE UI */

export interface ConfirmState {
  open: boolean;
  type: "toggle" | "delete" | null;
  item: PersonaListItem | null;
  loading: boolean;
}
