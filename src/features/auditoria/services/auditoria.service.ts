import apiClient from "@/config/axios.config";
import { http } from "@/shared/services/http.service";
import type { ApiResponse, RequestParams } from "@/shared/types/api.types";
import type {
  AuditoriaListItem,
  AuditoriaDetalle,
  AccionAuditoria,
  EntidadAuditoria,
  AuditoriaExportData,
} from "../types/auditoria.types";

export const auditoriaService = {
  getAll: (params?: RequestParams) =>
    http.getPaginated<AuditoriaListItem>("/auditoria", params),

  getById: (id: number) => http.get<AuditoriaDetalle>(`/auditoria/${id}`),

  getAcciones: () => http.get<AccionAuditoria[]>("/auditoria/acciones"),

  getEntidades: () => http.get<EntidadAuditoria[]>("/auditoria/entidades"),

  exportar: async (
    params?: RequestParams,
  ): Promise<ApiResponse<AuditoriaExportData>> => {
    const res = await apiClient.get<ApiResponse<AuditoriaExportData>>(
      "/auditoria/exportar",
      { params },
    );
    return res.data;
  },
};
