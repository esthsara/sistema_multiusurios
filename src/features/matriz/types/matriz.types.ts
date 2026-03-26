/**
 * Tipos para la Matriz de Roles y Permisos
 */

export interface MatrizPermiso {
  id: number;
  name: string;
  modulo: string;
  accion: string;
}

export interface MatrizRol {
  id: number;
  name: string;
  userCount: number;
  permisos: number[];
}

export interface MatrizData {
  roles: MatrizRol[];
  permisos: MatrizPermiso[];
}

export interface MatrizChange {
  rolId: number;
  permisoId: number;
  asignado: boolean;
}

export interface MatrizFilters {
  search?: string;
  modulos?: string[];
  roles?: number[];
}

export interface SyncMatrizRequest {
  changes: MatrizChange[];
}
