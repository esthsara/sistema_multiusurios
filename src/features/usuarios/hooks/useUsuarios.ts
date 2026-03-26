import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { usuariosService } from "../services/usuarios.service";
import { useTableState } from "@/shared/hooks/useTableState";
import type { UsuarioListItem, UsuarioFilters } from "../types/usuario.types";
import type { RequestParams } from "@/shared/types/api.types";

export const useUsuarios = () => {
  const [data, setData] = useState<UsuarioListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const rolesCacheRef = useRef<
    Map<
      number,
      {
        roles?: string[];
        roles_detalle?: Array<{ id: number; name: string; guard_name: string }>;
      }
    >
  >(new Map());

  /* Filtros de tabla */

  const table = useTableState<UsuarioFilters>({
    estado: "",
    sucursal_id: "",
    rol: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as RequestParams;
      const res = await usuariosService.getAll(params);

      let nextData = Array.isArray(res.data) ? [...res.data] : [];

      const mergeWithCache = (items: UsuarioListItem[]) =>
        items.map((item) => {
          const cached = rolesCacheRef.current.get(item.id);
          if (!cached) return item;
          return {
            ...item,
            roles: cached.roles ?? item.roles,
            roles_detalle: cached.roles_detalle ?? item.roles_detalle,
          };
        });

      nextData = mergeWithCache(nextData);

      /* Fallback local: búsqueda por nombre, username o email */
      const searchTerm = table.state.search.trim().toLowerCase();
      if (searchTerm) {
        nextData = nextData.filter((item) => {
          const fullName = (
            item.persona.razon_social ??
            `${item.persona.nombre ?? ""} ${item.persona.apellido ?? ""}`.trim()
          ).toLowerCase();

          return (
            fullName.includes(searchTerm) ||
            item.username.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm) ||
            item.persona.identificacion_principal
              .toLowerCase()
              .includes(searchTerm) ||
            false
          );
        });
      }

      // Fallback local: filtro por estado
      if (typeof table.state.filters.estado === "boolean") {
        nextData = nextData.filter(
          (item) => item.activo === table.state.filters.estado,
        );
      }

      // Fallback local: filtro por fecha exacta de registro
      const exactDate = table.state.filters.fecha_desde?.trim();
      if (exactDate) {
        nextData = nextData.filter((item) => {
          const createdDate = item.created_at?.slice(0, 10) ?? "";
          return createdDate === exactDate;
        });
      }

      // Fallback local: filtro por rol
      const rolFilter = table.state.filters.rol?.trim().toLowerCase();
      if (rolFilter) {
        const missingRoleIds = nextData
          .filter((item) => !rolesCacheRef.current.has(item.id))
          .map((item) => item.id);

        if (missingRoleIds.length) {
          const roleFetches = await Promise.allSettled(
            missingRoleIds.map((id) => usuariosService.getById(id)),
          );

          roleFetches.forEach((result, index) => {
            if (result.status === "fulfilled") {
              const id = missingRoleIds[index];
              rolesCacheRef.current.set(id, {
                roles: result.value.data.roles,
                roles_detalle: result.value.data.roles_detalle,
              });
            }
          });

          nextData = mergeWithCache(nextData);
        }

        nextData = nextData.filter((item) => {
          const roleNames =
            item.roles_detalle?.map((role) => role.name.toLowerCase()) ??
            item.roles?.map((role) => role.toLowerCase()) ??
            [];
          return roleNames.some((roleName) => roleName.includes(rolFilter));
        });
      }

      /* Fallback local: orden por nombre */
      if (table.state.sort?.field === "display_name") {
        nextData.sort((a, b) => {
          const aFallbackName =
            `${a.persona.nombre ?? ""} ${a.persona.apellido ?? ""}`.trim();
          const bFallbackName =
            `${b.persona.nombre ?? ""} ${b.persona.apellido ?? ""}`.trim();

          const aName = (
            (a.persona.razon_social ?? aFallbackName) ||
            a.username
          ).toLowerCase();
          const bName = (
            (b.persona.razon_social ?? bFallbackName) ||
            b.username
          ).toLowerCase();

          const compare = aName.localeCompare(bName, "es", {
            sensitivity: "base",
          });
          return table.state.sort?.direction === "asc" ? compare : -compare;
        });
      }

      if (import.meta.env.DEV) {
        console.groupCollapsed("[useUsuarios.fetchUsuarios]");
        console.log("params:", params);
        console.log("response normalized:", res);
        console.log("search term:", searchTerm);
        console.log("estado filter:", table.state.filters.estado);
        console.log("date filter:", exactDate);
        console.log("rol filter:", rolFilter);
        console.log(
          "items length:",
          Array.isArray(nextData) ? nextData.length : "no-array",
        );
        console.log("total:", searchTerm ? nextData.length : res.meta?.total);
        console.groupEnd();
      }

      setData(nextData);

      const hasLocalFallbackFilters =
        Boolean(searchTerm) ||
        typeof table.state.filters.estado === "boolean" ||
        Boolean(exactDate) ||
        Boolean(rolFilter);

      setTotal(hasLocalFallbackFilters ? nextData.length : res.meta.total);

      // Carga de roles en background para render rápido de tabla
      const missingRoleIdsForBackground = nextData
        .filter((item) => !rolesCacheRef.current.has(item.id))
        .map((item) => item.id);

      if (missingRoleIdsForBackground.length && !rolFilter) {
        void Promise.allSettled(
          missingRoleIdsForBackground.map((id) => usuariosService.getById(id)),
        ).then((results) => {
          let hasUpdates = false;

          results.forEach((result, index) => {
            if (result.status === "fulfilled") {
              const id = missingRoleIdsForBackground[index];
              rolesCacheRef.current.set(id, {
                roles: result.value.data.roles,
                roles_detalle: result.value.data.roles_detalle,
              });
              hasUpdates = true;
            }
          });

          if (hasUpdates) {
            setData((prev) =>
              prev.map((item) => {
                const cached = rolesCacheRef.current.get(item.id);
                if (!cached) return item;
                return {
                  ...item,
                  roles: cached.roles ?? item.roles,
                  roles_detalle: cached.roles_detalle ?? item.roles_detalle,
                };
              }),
            );
          }
        });
      }
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [table.toParams]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const toggleEstado = async (usuario: UsuarioListItem) => {
    const nuevoEstado = !usuario.activo;
    try {
      await usuariosService.toggleEstado(usuario.id, nuevoEstado);
      toast.success(
        nuevoEstado
          ? "Usuario activado correctamente"
          : "Usuario desactivado correctamente",
      );
      fetchUsuarios();
    } catch {
      toast.error("Error al cambiar estado");
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
