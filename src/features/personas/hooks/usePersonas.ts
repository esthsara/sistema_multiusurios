// src/features/personas/hooks/usePersonas.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { personasService } from "../services/personas.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type {
  PersonaListItem,
  PersonaFilters,
  PersonaQueryParams,
} from "../types/persona.types";

export const usePersonas = () => {
  const [data, setData] = useState<PersonaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const table = useTableState<PersonaFilters>({
    tipo_persona: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BÚSQUEDA LOCAL (Fallback) */

  const applyLocalSearch = (items: PersonaListItem[]): PersonaListItem[] => {
    const searchTerm = table.state.search.trim().toLowerCase();
    if (!searchTerm) return items;

    return items.filter((item) => {
      const fullName = (
        item.razon_social ??
        `${item.nombre ?? ""} ${item.apellido ?? ""}`.trim()
      ).toLowerCase();

      return (
        fullName.includes(searchTerm) ||
        item.display_name.toLowerCase().includes(searchTerm) ||
        item.identificacion_principal.toLowerCase().includes(searchTerm) ||
        item.usuario_asociado?.username.toLowerCase().includes(searchTerm) ||
        false
      );
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FILTRO LOCAL POR FECHA */

  const applyDateFilter = (items: PersonaListItem[]): PersonaListItem[] => {
    const exactDate = table.state.filters.fecha_desde?.trim();
    if (!exactDate) return items;

    return items.filter((item) => {
      const createdDate = item.fecha_registro?.slice(0, 10) ?? "";
      return createdDate === exactDate;
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ORDENAMIENTO LOCAL */

  const applySorting = (items: PersonaListItem[]): PersonaListItem[] => {
    if (table.state.sort?.field !== "display_name") return items;

    return [...items].sort((a, b) => {
      const aFallbackName = `${a.nombre ?? ""} ${a.apellido ?? ""}`.trim();
      const bFallbackName = `${b.nombre ?? ""} ${b.apellido ?? ""}`.trim();

      const aName = (
        (a.razon_social ?? aFallbackName) ||
        a.display_name
      ).toLowerCase();
      const bName = (
        (b.razon_social ?? bFallbackName) ||
        b.display_name
      ).toLowerCase();

      const compare = aName.localeCompare(bName, "es", {
        sensitivity: "base",
      });
      return table.state.sort?.direction === "asc" ? compare : -compare;
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FETCH PERSONAS */

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as PersonaQueryParams;
      const res = await personasService.getAll(params);

      let nextData = Array.isArray(res.data) ? [...res.data] : [];
      const searchTerm = table.state.search.trim().toLowerCase();

      // Aplicar filtros locales
      nextData = applyLocalSearch(nextData);
      nextData = applyDateFilter(nextData);
      nextData = applySorting(nextData);

      /*if (import.meta.env.DEV) {
        console.groupCollapsed("[usePersonas.fetchPersonas]");
        console.log("params:", params);
        console.log("response normalized:", res);
        console.log("search term:", searchTerm);
        console.log(
          "items length:",
          Array.isArray(nextData) ? nextData.length : "no-array",
        );
        console.log("total:", searchTerm ? nextData.length : res.meta?.total);
        console.groupEnd();
      }*/

      setData(nextData);
      setTotal(searchTerm ? nextData.length : res.meta.total);
    } catch {
      toast.error("Error al cargar personas");
    } finally {
      setLoading(false);
    }
  }, [table.toParams]);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ACCIONES */

  const toggleEstado = async (persona: PersonaListItem) => {
    const nuevoEstado = persona.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    try {
      await personasService.toggleEstado(persona.id, nuevoEstado);
      toast.success(
        nuevoEstado === "ACTIVO"
          ? "Persona activada correctamente"
          : "Persona desactivada correctamente",
      );
      fetchPersonas();
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  const remove = async (id: number) => {
    try {
      await personasService.remove(id);
      toast.success("Persona eliminada correctamente");
      fetchPersonas();
    } catch {
      toast.error("Error al eliminar persona");
    }
  };

  const restore = async (id: number) => {
    try {
      await personasService.restore(id);
      toast.success("Persona restaurada correctamente");
      fetchPersonas();
    } catch {
      toast.error("Error al restaurar persona");
    }
  };

  return {
    data,
    total,
    loading,
    table,
    fetchPersonas,
    toggleEstado,
    remove,
    restore,
  };
};
