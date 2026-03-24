// src/shared/types/table.types.ts
import type { TableColumnsType } from "antd";

/**
 * DataTableProps<T> — Props genéricas para la tabla reutilizable.
 *
 * T extends object → T debe ser un objeto (no primitivo).
 * Esto garantiza que podemos acceder a propiedades de T.
 *
 * TableColumnsType<T> → tipo oficial de Ant Design para columnas.
 * Cuando defines dataIndex, TypeScript verifica que
 * ese campo exista en T.
 * 
 * Una tabla genérica DataTable<T> acepta cualquier tipo de dato.
 */
export interface DataTableProps<T extends object> {
  /** Datos a mostrar */
  data: T[];
  /** Definición de columnas — tipada contra T */
  columns: TableColumnsType<T>;
  /** Clave única por fila — debe ser un campo de T */
  rowKey: keyof T | ((record: T) => string);
  /** Estado de carga */
  loading?: boolean;
  /** Configuración de paginación del servidor */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  /** Texto cuando no hay datos */
  emptyText?: string;
  /** Alto del scroll horizontal */
  scrollX?: number;
  /** Callback al hacer clic en una fila */
  onRowClick?: (record: T) => void;
}

/**
 * SortConfig — Estado de ordenamiento.
 * Usado en hooks de fetching para construir el query string.
 */
export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

/**
 * TableState — Estado completo de una tabla con paginación.
 * Generic <F> → el tipo de los filtros varía por módulo.
 */
export interface TableState<F extends object = object> {
  page: number;
  pageSize: number;
  search: string;
  sort: SortConfig | null;
  filters: F;
}
