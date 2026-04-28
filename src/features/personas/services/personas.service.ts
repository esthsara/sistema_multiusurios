// src/features/personas/services/personas.service.ts
import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  PersonaListItem,
  PersonaDetalle,
  CreatePersonaDto,
  UpdatePersonaDto,
} from "../types/persona.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NORMALIZADORES */

const normalizePersonaListItem = (item: PersonaListItem): PersonaListItem => {
  const nombreCompleto =
    item.nombre_completo?.trim() ||
    (item.nombre && item.apellido
      ? `${item.nombre} ${item.apellido}`.trim()
      : null) ||
    item.razon_social ||
    null;

  const displayName =
    item.display_name?.trim() ||
    item.nombre ||
    item.razon_social ||
    "Sin nombre";

  return {
    ...item,
    nombre_completo: nombreCompleto,
    display_name: displayName,
  };
};

const normalizePersonaList = (items: PersonaListItem[]): PersonaListItem[] =>
  items.map(normalizePersonaListItem);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   API CALLS */

export const personasService = {
  getAll: async (params?: RequestParams) => {
    const res = await http.getPaginated<PersonaListItem>("/personas", params);
    return {
      ...res,
      data: normalizePersonaList(res.data),
    };
  },

  getFisicas: async (params?: RequestParams) => {
    const res = await http.getPaginated<PersonaListItem>(
      "/personas/fisicas",
      params,
    );
    return {
      ...res,
      data: normalizePersonaList(res.data),
    };
  },

  getMorales: async (params?: RequestParams) => {
    const res = await http.getPaginated<PersonaListItem>(
      "/personas/morales",
      params,
    );
    return {
      ...res,
      data: normalizePersonaList(res.data),
    };
  },

  getById: (id: number) => http.get<PersonaDetalle>(`/personas/${id}`),

  create: (data: CreatePersonaDto) =>
    http.post<PersonaDetalle, CreatePersonaDto>("/personas", data),

  update: (id: number, data: UpdatePersonaDto) =>
    http.put<PersonaDetalle, UpdatePersonaDto>(`/personas/${id}`, data),

  toggleEstado: (id: number, estado: "ACTIVO" | "INACTIVO") =>
    http.patch<PersonaDetalle>(`/personas/${id}`, { estado }),

  remove: (id: number) => http.delete(`/personas/${id}`),

  restore: (id: number) =>
    http.post<PersonaDetalle, Record<string, never>>(
      `/personas/${id}/restore`,
      {},
    ),
};
