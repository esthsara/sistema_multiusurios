import { useCallback } from "react";
import { toast } from "react-toastify";
import { usuariosService } from "../services/usuarios.service";

export const useSucursalesUsuario = () => {
  const asignarSucursal = useCallback(async (userId: number, sucursalId: number) => {
    try {
      await usuariosService.asignarSucursal(userId, sucursalId);
      toast.success("Sucursal asignada exitosamente");
      return true;
    } catch {
      toast.error("Error al asignar sucursal");
      return false;
    }
  }, []);

  const desasignarSucursal = useCallback(
    async (userId: number, sucursalId: number) => {
      try {
        await usuariosService.desasignarSucursal(userId, sucursalId);
        toast.success("Sucursal desasignada exitosamente");
        return true;
      } catch {
        toast.error("Error al desasignar sucursal");
        return false;
      }
    },
    [],
  );

  return {
    asignarSucursal,
    desasignarSucursal,
  };
};
