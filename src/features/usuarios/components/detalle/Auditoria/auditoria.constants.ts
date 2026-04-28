export interface AuditoriaItem {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
  accion: string;
  accion_texto: string;
  entidad_type: string;
  entidad_nombre: string;
  entidad_id: number;
  ip: string | null;
  created_at: string;
  created_at_humano: string;
  fecha: string;
}

export const ACCION_COLOR: Record<string, string> = {
  LOGIN_SUCCESS: "green",
  LOGOUT: "orange",
  CREATE: "blue",
  UPDATE: "cyan",
  DELETE: "red",
  USUARIO_CREADO: "blue",
  USUARIO_ACTUALIZADO: "cyan",
  USUARIO_ACTIVADO: "green",
  USUARIO_DESACTIVADO: "red",
  SWITCH_BRANCH: "purple",
  USUARIO_ASIGNADO_SUCURSAL: "gold",
};
