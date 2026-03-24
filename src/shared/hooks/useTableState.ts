// src/shared/hooks/useTableState.ts
import { useState, useCallback } from "react";
import type { TableState, SortConfig } from "@/shared/types/table.types";

/**
 * useTableState<F> — Maneja el estado completo de una tabla.
 *
 * Generic <F> → el tipo de filtros varía por módulo.
 * Ejemplo:
 *   useTableState<{ estado: string }>()
 *   useTableState<{ rol: string; activo: boolean }>()
 */
export const useTableState = <F extends object = object>(
  initialFilters?: F,
) => {
  const [state, setState] = useState<TableState<F>>({
    page: 1,
    pageSize: 10,
    search: "",
    sort: null,
    filters: initialFilters ?? ({} as F),
  });

  const setPage = useCallback((page: number, pageSize: number) => {
    setState((prev) => ({ ...prev, page, pageSize }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
    // Resetea a página 1 al buscar
  }, []);

  const setSort = useCallback((sort: SortConfig | null) => {
    setState((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<F>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      page: 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      page: 1,
      pageSize: 10,
      search: "",
      sort: null,
      filters: initialFilters ?? ({} as F),
    });
  }, [initialFilters]);

  /**
   * toParams — Convierte el estado en query params para la API.
   * Compatible con RequestParams del Paso 5.
   */
  const toParams = useCallback(() => {
    const rawParams = {
      page: state.page,
      per_page: state.pageSize,
      search: state.search || undefined,
      sort_by: state.sort?.field,
      sort_dir: state.sort?.direction,
      ...state.filters,
    } as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(rawParams).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string") return value.trim() !== "";
        return true;
      }),
    );
  }, [state]);

  return {
    state,
    setPage,
    setSearch,
    setSort,
    setFilters,
    reset,
    toParams,
  };
};
