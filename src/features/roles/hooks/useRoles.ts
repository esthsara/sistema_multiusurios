import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { rolesService } from "../services/roles.service";
import { useTableState } from "@/shared/hooks/useTableState";
import { permisosService } from "@/features/permisos/services/permisos.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import type {
  RolListItem,
  CreateRolDto,
  UpdateRolDto,
  RolPermission,
  RolUsuarioItem,
  RolFilters,
} from "../types/rol.types";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";

export const useRoles = () => {
  const [data, setData] = useState<RolListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [permissionsCatalog, setPermissionsCatalog] = useState<PermisoItem[]>(
    [],
  );
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roleUsers, setRoleUsers] = useState<RolUsuarioItem[]>([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);

  const table = useTableState<RolFilters>({
    search: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  const getRoleEstado = useCallback(
    (role: RolListItem): "activo" | "inactivo" => {
      if (typeof role.activo === "boolean") {
        return role.activo ? "activo" : "inactivo";
      }

      if (typeof role.is_active === "boolean") {
        return role.is_active ? "activo" : "inactivo";
      }

      if (typeof role.estado === "string") {
        const value = role.estado.trim().toLowerCase();
        if (["activo", "active", "1", "true"].includes(value)) {
          return "activo";
        }
        if (["inactivo", "inactive", "0", "false"].includes(value)) {
          return "inactivo";
        }
      }

      if (role.deleted_at) {
        return "inactivo";
      }

      return "activo";
    },
    [],
  );

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rolesService.getAll();
      const roles = res.data.items ?? [];
      const search = table.state.search.trim().toLowerCase();
      const estado = table.state.filters.estado ?? "";
      const fechaDesde = table.state.filters.fecha_desde ?? "";
      const fechaHasta = table.state.filters.fecha_hasta ?? "";

      const fromDate = fechaDesde
        ? dayjs(fechaDesde, "YYYY-MM-DD", true).startOf("day")
        : null;
      const toDate = fechaHasta
        ? dayjs(fechaHasta, "YYYY-MM-DD", true).endOf("day")
        : null;

      const filtered = roles.filter((role) => {
        if (search && !role.name.toLowerCase().includes(search)) {
          return false;
        }

        if (estado && getRoleEstado(role) !== estado) {
          return false;
        }

        if (fromDate || toDate) {
          if (!role.created_at) return false;
          const createdAt = dayjs(role.created_at);
          if (!createdAt.isValid()) return false;

          if (fromDate && createdAt.isBefore(fromDate)) {
            return false;
          }

          if (toDate && createdAt.isAfter(toDate)) {
            return false;
          }
        }

        return true;
      });

      setData(filtered);
      setTotal(filtered.length);
    } catch {
      toast.error("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, [
    table.state.search,
    table.state.filters.estado,
    table.state.filters.fecha_desde,
    table.state.filters.fecha_hasta,
    getRoleEstado,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoles();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchRoles]);

  const fetchPermissionsCatalog = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      const res = await permisosService.getAll({ per_page: 200 });
      setPermissionsCatalog(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar catálogo de permisos");
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  const getRoleDetail = useCallback(async (rolId: number) => {
    try {
      const res = await rolesService.getById(rolId);
      return res.data;
    } catch {
      toast.error("Error al cargar detalle del rol");
      return null;
    }
  }, []);

  const createRole = useCallback(
    async (values: CreateRolDto) => {
      setSubmitting(true);
      try {
        await rolesService.create({
          ...values,
          guard_name: values.guard_name ?? "api",
        });
        toast.success("Rol creado correctamente");
        fetchRoles();
        return true;
      } catch {
        toast.error("Error al crear rol");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoles],
  );

  const updateRole = useCallback(
    async (
      rolId: number,
      roleData: UpdateRolDto,
      permissionIds: number[] = [],
    ) => {
      setSubmitting(true);
      try {
        await rolesService.update(rolId, roleData);
        await rolesService.syncPermissions(rolId, {
          permissions: permissionIds,
        });

        toast.success("Rol actualizado correctamente");
        fetchRoles();
        return true;
      } catch {
        toast.error("Error al actualizar rol");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoles],
  );

  const deleteRole = useCallback(
    async (rolId: number) => {
      setSubmitting(true);
      try {
        await rolesService.remove(rolId);
        toast.success("Rol eliminado correctamente");
        fetchRoles();
        return true;
      } catch {
        toast.error("Error al eliminar rol");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoles],
  );

  const copyRole = useCallback(
    async (sourceRoleId: number, newName: string) => {
      setSubmitting(true);
      try {
        const detailRes = await rolesService.getById(sourceRoleId);
        const source = detailRes.data;
        const permissionIds = source.permissions.map((p) => p.id);

        const created = await rolesService.create({
          name: newName,
          guard_name: source.guard_name || "api",
          permissions: permissionIds,
        });

        const createdId = created.data?.id;
        if (createdId && permissionIds.length) {
          await rolesService.syncPermissions(createdId, {
            permissions: permissionIds,
          });
        }

        toast.success("Rol copiado correctamente");
        fetchRoles();
        return true;
      } catch {
        toast.error("Error al copiar rol");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoles],
  );

  const fetchUsersByRole = useCallback(async (role: RolListItem) => {
    setLoadingRoleUsers(true);
    try {
      const res = await usuariosService.getAll({ per_page: 300 });
      const users = Array.isArray(res.data) ? res.data : [];

      const filtered = users
        .filter((user) => {
          const byName = (user.roles ?? []).includes(role.name);
          const byId = (user.roles_detalle ?? []).some((r) => r.id === role.id);
          return byName || byId;
        })
        .map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          activo: user.activo,
          persona: user.persona,
        }));

      setRoleUsers(filtered);
    } catch {
      toast.error("Error al cargar usuarios del rol");
      setRoleUsers([]);
    } finally {
      setLoadingRoleUsers(false);
    }
  }, []);

  const clearRoleUsers = useCallback(() => setRoleUsers([]), []);

  const getPermissionIds = useCallback((permissions: RolPermission[]) => {
    return permissions.map((permission) => permission.id);
  }, []);

  return {
    data,
    total,
    loading,
    submitting,
    table,
    permissionsCatalog,
    loadingPermissions,
    roleUsers,
    loadingRoleUsers,
    fetchRoles,
    fetchPermissionsCatalog,
    getRoleDetail,
    createRole,
    updateRole,
    deleteRole,
    copyRole,
    fetchUsersByRole,
    clearRoleUsers,
    getPermissionIds,
    getRoleEstado,
  };
};
