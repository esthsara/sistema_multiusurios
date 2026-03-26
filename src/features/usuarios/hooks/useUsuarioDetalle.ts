import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { usuariosService } from "../services/usuarios.service";
import type { UsuarioDetalle } from "../types/usuario.types";

export const useUsuarioDetalle = (id: number) => {
  const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usuariosService.getById(id);
      setUsuario(res.data);
    } catch {
      toast.error("Error al cargar el usuario");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  const toggleBloqueo = async () => {
    if (!usuario) return;
    try {
      await usuariosService.toggleStatus(id, {
        activo: !usuario.activo,
        motivo: "Acción desde panel de administración",
      });
      toast.success(
        usuario.activo ? "Usuario bloqueado" : "Usuario desbloqueado",
      );
      fetchUsuario();
    } catch {
      toast.error("Error al cambiar estado del usuario");
    }
  };

  const cerrarSesiones = async () => {
    try {
      await usuariosService.cerrarSesiones(id);
      toast.success("Sesiones cerradas correctamente");
      fetchUsuario();
    } catch {
      toast.error("Error al cerrar sesiones");
    }
  };

  const cambiarRol = async (rolId: number) => {
    try {
      await usuariosService.cambiarRol(id, rolId);
      toast.success("Rol actualizado correctamente");
      fetchUsuario();
    } catch {
      toast.error("Error al cambiar el rol");
    }
  };

  return {
    usuario,
    loading,
    refetch: fetchUsuario,
    toggleBloqueo,
    cerrarSesiones,
    cambiarRol,
  };
};
