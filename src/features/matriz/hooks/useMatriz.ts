import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { matrizService } from "../services/matriz.service";
import type {
  MatrizRol,
  MatrizPermisosAgrupados,
  MatrizEstado,
  MatrizCambio,
} from "../types/matriz.types";

export const useMatriz = () => {
  const [roles, setRoles] = useState<MatrizRol[]>([]);
  const [permisosAgrupados, setPermisosAgrupados] =
    useState<MatrizPermisosAgrupados>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado actual de la matriz: Map<rolId, Set<permisoId>>
  const [estado, setEstado] = useState<MatrizEstado>(new Map());

  // Snapshot original para calcular el diff
  const [original, setOriginal] = useState<MatrizEstado>(new Map());

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permisosRes] = await Promise.all([
        matrizService.getRoles(),
        matrizService.getPermisosAgrupados(),
      ]);

      const listaRoles: MatrizRol[] = rolesRes.data ?? [];
      setRoles(listaRoles);
      setPermisosAgrupados(permisosRes.data ?? {});

      // Construir el mapa inicial de permisos por rol
      const mapa: MatrizEstado = new Map();
      listaRoles.forEach((rol) => {
        mapa.set(rol.id, new Set(rol.permissions.map((p) => p.id)));
      });

      setEstado(mapa);
      // Deep copy para el snapshot original
      setOriginal(new Map([...mapa].map(([k, v]) => [k, new Set(v)])));
    } catch {
      toast.error("Error al cargar la matriz de permisos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ── Toggle de un permiso para un rol ──────────────────────────────────────
  const togglePermiso = useCallback((rolId: number, permisoId: number) => {
    setEstado((prev) => {
      const next = new Map([...prev].map(([k, v]) => [k, new Set(v)]));
      const permisos = next.get(rolId) ?? new Set<number>();
      if (permisos.has(permisoId)) {
        permisos.delete(permisoId);
      } else {
        permisos.add(permisoId);
      }
      next.set(rolId, permisos);
      return next;
    });
  }, []);

  // ── Toggle de todos los permisos de un módulo para un rol ─────────────────
  const toggleModulo = useCallback(
    (rolId: number, permisoIds: number[], todos: boolean) => {
      setEstado((prev) => {
        const next = new Map([...prev].map(([k, v]) => [k, new Set(v)]));
        const permisos = next.get(rolId) ?? new Set<number>();
        if (todos) {
          permisoIds.forEach((id) => permisos.delete(id));
        } else {
          permisoIds.forEach((id) => permisos.add(id));
        }
        next.set(rolId, permisos);
        return next;
      });
    },
    [],
  );

  // ── Calcular cambios pendientes (diff vs original) ─────────────────────────
  const cambios = useMemo<MatrizCambio[]>(() => {
    const lista: MatrizCambio[] = [];
    const todosPermisos = Object.values(permisosAgrupados).flat();

    roles.forEach((rol) => {
      const estadoActual = estado.get(rol.id) ?? new Set<number>();
      const estadoOrig = original.get(rol.id) ?? new Set<number>();

      estadoActual.forEach((pid) => {
        if (!estadoOrig.has(pid)) {
          const permiso = todosPermisos.find((p) => p.id === pid);
          lista.push({
            rolId: rol.id,
            rolName: rol.name,
            permisoId: pid,
            permisoName: permiso?.name ?? String(pid),
            accion: "agregar",
          });
        }
      });

      estadoOrig.forEach((pid) => {
        if (!estadoActual.has(pid)) {
          const permiso = todosPermisos.find((p) => p.id === pid);
          lista.push({
            rolId: rol.id,
            rolName: rol.name,
            permisoId: pid,
            permisoName: permiso?.name ?? String(pid),
            accion: "quitar",
          });
        }
      });
    });

    return lista;
  }, [estado, original, roles, permisosAgrupados]);

  // ── Guardar todos los cambios ──────────────────────────────────────────────
  const guardar = useCallback(async () => {
    // Roles que tienen cambios
    const rolesAfectados = [...new Set(cambios.map((c) => c.rolId))];
    setSaving(true);
    try {
      await Promise.all(
        rolesAfectados.map((rolId) => {
          const permisoIds = [...(estado.get(rolId) ?? new Set<number>())];
          return matrizService.sincronizarPermisos(rolId, permisoIds);
        }),
      );
      // Actualizar snapshot
      setOriginal(new Map([...estado].map(([k, v]) => [k, new Set(v)])));
      toast.success(`${cambios.length} cambios guardados correctamente`);
    } catch {
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  }, [cambios, estado]);

  // ── Descartar cambios ──────────────────────────────────────────────────────
  const descartar = useCallback(() => {
    setEstado(new Map([...original].map(([k, v]) => [k, new Set(v)])));
  }, [original]);

  // ── Helper: ¿tiene el rol el permiso? ─────────────────────────────────────
  const tienePermiso = useCallback(
    (rolId: number, permisoId: number) =>
      estado.get(rolId)?.has(permisoId) ?? false,
    [estado],
  );

  // ── Helper: ¿tiene el rol TODOS los permisos de un módulo? ────────────────
  const tieneModuloCompleto = useCallback(
    (rolId: number, permisoIds: number[]) =>
      permisoIds.every((id) => estado.get(rolId)?.has(id) ?? false),
    [estado],
  );

  return {
    roles,
    permisosAgrupados,
    modulos: Object.keys(permisosAgrupados),
    loading,
    saving,
    cambios,
    hayCambios: cambios.length > 0,
    tienePermiso,
    tieneModuloCompleto,
    togglePermiso,
    toggleModulo,
    guardar,
    descartar,
  };
};
