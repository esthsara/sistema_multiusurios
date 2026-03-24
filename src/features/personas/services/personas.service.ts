// src/features/personas/services/personas.service.ts
import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";
import type {
  PersonaListItem,
  PersonaDetalle,
  CreatePersonaDto,
  UpdatePersonaDto,
} from "../types/persona.types";

export const personasService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<PersonaListItem>("/personas", params),

  getFisicas: (params?: RequestParams) =>
    http.getPaginated<PersonaListItem>("/personas/fisicas", params),

  getMorales: (params?: RequestParams) =>
    http.getPaginated<PersonaListItem>("/personas/morales", params),

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
