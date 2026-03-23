// src/features/personas/services/personas.service.ts
import { http } from "@/shared/services/http.service";
import type { RequestParams } from "@/shared/types/api.types";

/**
 * Persona — Tipo local del feature.
 * En Paso 10 este tipo estará en personas/types/persona.types.ts
 */
interface Persona {
  id: number;
  tipo: "fisica" | "moral";
  nombre: string;
  rfc?: string;
  activo: boolean;
}

interface CreatePersonaDto {
  tipo: "fisica" | "moral";
  nombre: string;
  rfc?: string;
}

/**
 * ¿Por qué un objeto en lugar de funciones sueltas?
 * Agrupa lógicamente todo lo de personas.
 * personasService.getAll() es más legible que getPersonas()
 * 
 */
export const personasService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<Persona>("/personas", params),

  getById: (id: number) => http.get<Persona>(`/personas/${id}`),

  create: (data: CreatePersonaDto) =>
    http.post<Persona, CreatePersonaDto>("/personas", data),

  update: (id: number, data: Partial<CreatePersonaDto>) =>
    http.put<Persona, Partial<CreatePersonaDto>>(`/personas/${id}`, data),

  toggleActivo: (id: number) =>
    http.patch<Persona>(`/personas/${id}/toggle-activo`),

  remove: (id: number) => http.delete(`/personas/${id}`),
};
