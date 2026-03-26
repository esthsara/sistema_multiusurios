import { http } from "@/shared/services/http.service";
import type {
  CreateSucursalDomicilioDto,
  SucursalDomicilio,
  UpdateSucursalDomicilioDto,
} from "../types/sucursal.types";

export const sucursalDomiciliosService = {
  getBySucursal: (sucursalId: number) =>
    http.get<{ total: number; items: SucursalDomicilio[] }>(
      `/sucursales/${sucursalId}/domicilios`,
    ),

  create: (sucursalId: number, data: CreateSucursalDomicilioDto) =>
    http.post<SucursalDomicilio, CreateSucursalDomicilioDto>(
      `/sucursales/${sucursalId}/domicilios`,
      data,
    ),

  update: (domicilioId: number, data: UpdateSucursalDomicilioDto) =>
    http.put<SucursalDomicilio, UpdateSucursalDomicilioDto>(
      `/domicilios/${domicilioId}`,
      data,
    ),

  remove: (domicilioId: number) => http.delete(`/domicilios/${domicilioId}`),

  restore: (domicilioId: number) =>
    http.post<SucursalDomicilio, Record<string, never>>(
      `/domicilios/${domicilioId}/restore`,
      {},
    ),
};
