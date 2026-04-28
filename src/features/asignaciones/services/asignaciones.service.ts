import { http } from "@/shared/services/http.service";
import type {
  AsignarUsuarioDto,
} from "../types/asignacion.types";

export const asignacionesService = {
  /**
   * Asignar usuario a sucursal
   */
  asignar: (data: AsignarUsuarioDto) =>
    http.post<unknown, AsignarUsuarioDto>("/asignaciones", data),

  /**
   * Quitar usuario de sucursal
   */
  quitar: (sucursalId: number, usuarioId: number) =>
    http.delete(`/asignaciones/${sucursalId}/${usuarioId}`),


};
