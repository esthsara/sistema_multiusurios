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

export const ACCION_TONE: Record<
  string,
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "cyan"
  | "geekblue"
  | "volcano"
  | "lime"
  | "magenta"
  | "gold"
  | "blue"
> = {
  LOGIN_SUCCESS: "success",
  LOGOUT: "warning",
  CREATE: "primary",
  UPDATE: "cyan",
  DELETE: "danger",
  SWITCH_BRANCH: "purple",
  USUARIO_ASIGNADO_SUCURSAL: "gold",
};
