// ─── Permiso individual ───────────────────────────────────────────────────────
export interface MatrizPermiso {
  id: number;
  name: string;
  accion: string;
}

// ─── Permisos agrupados por módulo (GET /permisos/agrupados) ─────────────────
export type MatrizPermisosAgrupados = Record<string, MatrizPermiso[]>;

// ─── Rol con sus permisos activos (GET /roles) ───────────────────────────────
export interface MatrizRol {
  id: number;
  name: string;
  guard_name: string;
  sucursal_actual: number;
  permissions: Array<{
    id: number;
    name: string;
    modulo: string;
    accion: string;
  }>;
  created_at: string;
  updated_at: string;
}

// ─── Cambio pendiente por guardar ────────────────────────────────────────────
export interface MatrizCambio {
  rolId: number;
  rolName: string;
  permisoId: number;
  permisoName: string;
  accion: "agregar" | "quitar";
}

// ─── Estado interno de la matriz: Map<rolId, Set<permisoId>> ─────────────────
export type MatrizEstado = Map<number, Set<number>>;
