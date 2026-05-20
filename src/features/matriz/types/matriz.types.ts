export interface MatrizFilters {
  search?: string;
  modulos?: string[];
  roles?: number[];
  selectedRol?: number | null;
}

export interface MatrizPermiso {
  id: number;
  name: string;
  accion: string;
}

export interface MatrizRol {
  id: number;
  name: string;
  permissions: MatrizPermiso[];
}

export type MatrizPermisosAgrupados = Record<string, MatrizPermiso[]>;

export type MatrizEstado = Map<number, Set<number>>;

export interface MatrizCambio {
  rolId: number;
  rolName: string;
  permisoId: number;
  permisoName: string;
  accion: "agregar" | "quitar";
}
