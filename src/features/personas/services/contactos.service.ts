// src/features/personas/services/contactos.service.ts
import { http } from "@/shared/services/http.service";
import type {
  Contacto,
  CreateContactoDto,
  UpdateContactoDto,
} from "../components/detalle/Contacto/contacto.constants";

export const contactosService = {
  getByPersona: (personaId: number) =>
    http.get<{ total: number; items: Contacto[] }>(
      `/personas/${personaId}/contactos`,
    ),
  create: (data: CreateContactoDto) =>
    http.post<Contacto, CreateContactoDto>("/contactos", data),
  update: (id: number, data: UpdateContactoDto) =>
    http.put<Contacto, UpdateContactoDto>(`/contactos/${id}`, data),
  remove: (id: number) => http.delete(`/contactos/${id}`),
};
