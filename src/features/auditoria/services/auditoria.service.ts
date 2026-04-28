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
  /*Obtener Auditoria con parametros */
  getAll: (params?: RequestParams) =>
    http.getPaginated<AuditoriaListItem>("/auditoria", params),

  /*Obtener detalle de auditoria por ID */
  getById: (id: number) => http.get<AuditoriaDetalle>(`/auditoria/${id}`),
  /*Todas las acciones hechas */
  getAcciones: () => http.get<AccionAuditoria[]>("/auditoria/acciones"),
  /*Obtener todas las entidades auditadas */
  getEntidades: () => http.get<EntidadAuditoria[]>("/auditoria/entidades"),
  /*Exportar datos de auditoria es decir generar un archivo */
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
