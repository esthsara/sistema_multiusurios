import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse, RequestParams } from "@/shared/types/api.types";
import type {
  AuditoriaListItem,
  AuditoriaDetalle,
  AccionAuditoria,
  EntidadAuditoria,
  ExportAuditoriaItem,
} from "../types/auditoria.types";

export const auditoriaService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<AuditoriaListItem>("/auditoria", params),

  getById: (id: number) => http.get<AuditoriaDetalle>(`/auditoria/${id}`),

  getAcciones: () => http.get<AccionAuditoria[]>("/auditoria/acciones"),

  getEntidades: () => http.get<EntidadAuditoria[]>("/auditoria/entidades"),

  exportar: async (): Promise<
    ApiResponse<{ total: number; data: ExportAuditoriaItem[] }>
  > => {
    const res = await apiClient.get("/auditoria/exportar");
    return res.data;
  },
};
