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
  "neutral" | "success" | "danger" | "geekblue" | "purple"
> = {
  "Archivo subido": "success",
  "Archivo eliminado": "danger",
  ARCHIVO_RESTAURADO: "purple",
  "Archivo actualizado": "geekblue",
  "Sucursal creada": "success",
  "Sucursal actualizada": "geekblue",
  "Sucursal eliminada": "danger",
  "Sucursal restaurada": "purple",
  "Usuario creado": "success",
  "Usuario actualizado": "geekblue",
  "Usuario eliminado": "danger",
  "Usuario restaurado": "purple",
  "Persona creada": "success",
  "Persona actualizada": "geekblue",
  "Persona eliminada": "danger",
  "Persona restaurada": "purple",
  "Inicio de sesión": "success",
  "Cierre de sesión": "neutral",
  "Domicilio creado": "success",
  "Domicilio actualizado": "geekblue",
  "Domicilio eliminado": "danger",
  "Domicilio restaurado": "purple",
  
};

export const getAuditoriaActionTone = (accion: string, accionTexto?: string) =>
  ACCION_TONE[accionTexto ?? ""] ?? ACCION_TONE[accion] ?? "neutral";
