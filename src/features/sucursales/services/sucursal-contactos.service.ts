import { http } from "@/shared/services/http.service";
import type {
  CreateSucursalContactoDto,
  SucursalContacto,
  UpdateSucursalContactoDto,
} from "../types/sucursal.types";

export const sucursalContactosService = {
  getBySucursal: (sucursalId: number) =>
    http.get<{ total: number; items: SucursalContacto[] }>(
      `/sucursales/${sucursalId}/contactos`,
    ),

  create: (sucursalId: number, data: CreateSucursalContactoDto) =>
    http.post<
      SucursalContacto,
      CreateSucursalContactoDto & { sucursal_id: number }
    >("/contactos", {
      ...data,
      sucursal_id: sucursalId,
    }),

  update: (contactoId: number, data: UpdateSucursalContactoDto) =>
    http.put<SucursalContacto, UpdateSucursalContactoDto>(
      `/contactos/${contactoId}`,
      data,
    ),

  remove: (contactoId: number) => http.delete(`/contactos/${contactoId}`),
};
