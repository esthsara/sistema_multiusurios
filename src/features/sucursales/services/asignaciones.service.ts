import { http } from "@/shared/services/http.service";
import type { AsignarUsuarioDto } from "../types/sucursal.types";

export const asignacionesService = {
  asignar: (data: AsignarUsuarioDto) =>
    http.post<unknown, AsignarUsuarioDto>("/asignaciones", data),

  /**
   * Quitar asignación — ruta: /asignaciones/{usuario_id}/{sucursal_id}
   */
  quitar: (usuarioId: number, sucursalId: number) =>
    http.delete(`/asignaciones/${usuarioId}/${sucursalId}`),
};
