// src/features/usuarios/hooks/useUsuarios.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { usuariosService } from "../services/usuarios.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type {
  UsuarioListItem,
  UsuarioFilters,
  UsuarioQueryParams,
} from "../types/usuario.types";
import { getUsuarioDisplayName } from "../utils/usuario.formatters";

export const useUsuarios = () => {
  const [data, setData] = useState<UsuarioListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const table = useTableState<UsuarioFilters>({
    sucursal_id: "",
    fecha_desde: "",
    estado: "",
    fecha_hasta: "",
    rol: "",
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BÚSQUEDA LOCAL (Fallback) */

  const applyLocalSearch = (items: UsuarioListItem[]): UsuarioListItem[] => {
    const searchTerm = table.state.search.trim().toLowerCase();
    if (!searchTerm) return items;

    return items.filter((item) => {
      const fullName = getUsuarioDisplayName(item).toLowerCase();
      const username = item.username?.toLowerCase() ?? "";
      const email = item.email?.toLowerCase() ?? "";
      const identificacion =
        item.persona.identificacion_principal?.toLowerCase() ?? "";

      return (
        fullName.includes(searchTerm) ||
        username.includes(searchTerm) ||
        email.includes(searchTerm) ||
        identificacion.includes(searchTerm)
      );
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FILTRO LOCAL POR FECHA */

  const applyDateFilter = (items: UsuarioListItem[]): UsuarioListItem[] => {
    const exactDate = table.state.filters.fecha_desde?.trim();
    if (!exactDate) return items;

    return items.filter((item) => {
      const createdDate = item.created_at?.slice(0, 10) ?? "";
      return createdDate === exactDate;
    });
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FETCH USUARIOS */

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as UsuarioQueryParams;
      const searchTerm = table.state.search.trim().toLowerCase();
      const exactDate = table.state.filters.fecha_desde?.trim();

      // Convertir estado a activo
      if (params.estado === "ACTIVO") {
        params.activo = true;
      } else if (params.estado === "INACTIVO") {
        params.activo = false;
      }
      delete params.estado;

      // No enviar al backend
      if (searchTerm) delete params.search;
      if (exactDate) {
        delete params.fecha_desde;
        delete params.fecha_hasta;
      }

      // Compatibilidad de ordenamiento
      if (
        params.sort_by === "display_name" ||
        params.sort_by === "persona.nombre"
      ) {
        params.sort_by = "username";
      }

      const res = await usuariosService.getAll(params);
      let nextData = Array.isArray(res.data) ? [...res.data] : [];

      // Aplicar filtros locales
      nextData = applyLocalSearch(nextData);
      nextData = applyDateFilter(nextData);

      setData(nextData);
      setTotal(searchTerm || exactDate ? nextData.length : res.meta.total);
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [table.state]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ACCIONES */

  const toggleEstado = async (usuario: UsuarioListItem, motivo?: string) => {
    try {
      await usuariosService.toggleStatus(usuario.id, {
        activo: !usuario.activo,
        motivo,
      });
      toast.success(
        usuario.activo
          ? "Usuario desactivado correctamente"
          : "Usuario activado correctamente",
      );
      fetchUsuarios();
    } catch {
      toast.error("Error al cambiar estado del usuario");
    }
  };

  const remove = async (id: number) => {
    try {
      await usuariosService.remove(id);
      toast.success("Usuario eliminado correctamente");
      fetchUsuarios();
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  return {
    data,
    total,
    loading,
    table,
    fetchUsuarios,
    toggleEstado,
    remove,
  };
};
