// src/features/personas/services/domicilios.service.ts
import { http } from "@/shared/services/http.service";
import type {
  Domicilio,
  CreateDomicilioDto,
  UpdateDomicilioDto,
} from "../components/detalle/Domicilio/domicilio.constants";

export const domiciliosService = {
  getByPersona: (personaId: number) =>
    http.get<{ total: number; items: Domicilio[] }>(
      `/personas/${personaId}/domicilios`,
    ),
  getPrincipal: (personaId: number) =>
    http.get<Domicilio>(`/personas/${personaId}/domicilio-principal`),
  create: (data: CreateDomicilioDto) =>
    http.post<Domicilio, CreateDomicilioDto>("/domicilios", data),
  update: (id: number, data: UpdateDomicilioDto) =>
    http.put<Domicilio, UpdateDomicilioDto>(`/domicilios/${id}`, data),
  remove: (id: number) => http.delete(`/domicilios/${id}`),
  restore: (id: number) =>
    http.post<Domicilio, Record<string, never>>(
      `/domicilios/${id}/restore`,
      {},
    ),
};
