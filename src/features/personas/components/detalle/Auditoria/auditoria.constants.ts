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
  "Archivo subido": "success",
  "Archivo eliminado": "danger",
  "Archivo actualizado": "geekblue",
  "Persona creada": "success",
  "Persona actualizada": "geekblue",
  "Persona eliminada": "danger",
  "Persona restaurada": "purple",
  "Usuario creado": "success",
  "Usuario actualizado": "geekblue",
  "Usuario eliminado": "danger",
  "Usuario restaurado": "purple",
  "Usuario roles asignado": "success",
  USUARIO_ROLES_ASIGNADO: "success",
  USUARIO_ROL_QUITADO: "danger",
  "Inicio de sesión": "success",
  "Cierre de sesión": "neutral",
  "Sucursal creada": "success",
  "Sucursal actualizada": "geekblue",
  "Sucursal eliminada": "danger",
  "Sucursal restaurada": "purple",
  "Domicilio creado": "success",
  "Domicilio actualizado": "geekblue",
  "Domicilio eliminado": "danger",
  "Domicilio restaurado": "purple",
  "Contacto creado": "success",
  "Contacto actualizado": "geekblue",
  "Contacto eliminado": "danger",
  "Contacto restaurado": "purple",
  LOGIN_SUCCESS: "success",
  LOGOUT: "neutral",
  CREATE: "primary",
  UPDATE: "cyan",
  DELETE: "danger",
  SWITCH_BRANCH: "purple",
  USUARIO_ASIGNADO_SUCURSAL: "gold",
};

export const getAuditoriaActionTone = (accion: string, accionTexto?: string) =>
  ACCION_TONE[accionTexto ?? ""] ?? ACCION_TONE[accion] ?? "neutral";
