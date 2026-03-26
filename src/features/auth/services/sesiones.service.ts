import { http } from "@/shared/services/http.service";
import type { SesionItem } from "../types/sesion.types";

export const sesionesService = {
  getMias: () => http.get<SesionItem[]>("/auth/sessions"),

  cerrar: (sessionId: number) => http.delete(`/auth/sessions/${sessionId}`),

  cerrarTodas: () => http.delete("/auth/sessions"),
};
