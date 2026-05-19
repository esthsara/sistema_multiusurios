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

export const getAuditoriaActionTone = (
  accion: string,
  accionTexto?: string,
) => {
  const action = accionTexto ?? accion;

  if (action.includes("elimin")) return "danger";
  if (action.includes("desactiv")) return "danger";
  if (action.includes("restaur")) return "purple";
  if (action.includes("asign")) return "gold";
  if (action.includes("actualiz")) return "cyan";
  if (action.includes("cread")) return "blue";
  if (action.includes("ingreso") || action.includes("login")) return "success";
  if (action.includes("cierre") || action.includes("logout")) return "warning";

  switch (accion) {
    case "CREATE":
      return "blue";
    case "UPDATE":
      return "cyan";
    case "DELETE":
      return "danger";
    case "LOGOUT":
      return "warning";
    case "LOGIN_SUCCESS":
      return "success";
    case "SWITCH_BRANCH":
      return "purple";
    case "USUARIO_ASIGNADO_SUCURSAL":
      return "gold";
    case "USUARIO_ACTIVADO":
      return "success";
    case "USUARIO_DESACTIVADO":
      return "danger";
    default:
      return "neutral";
  }
};
