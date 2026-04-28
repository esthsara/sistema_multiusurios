import { useCallback } from "react";
import { toast } from "react-toastify";
import { asignacionesService } from "../services/asignaciones.service";

export const useAsignaciones = () => {
  const asignar = useCallback(
    async (usuarioId: number, sucursalId: number): Promise<boolean> => {
      try {
        await asignacionesService.asignar({
          usuario_id: usuarioId,
          sucursal_id: sucursalId,
        });
        toast.success("Usuario asignado correctamente");
        return true;
      } catch {
        toast.error("Error al asignar usuario");
        return false;
      }
    },
    [],
  );

  const quitar = useCallback(
    async (sucursalId: number, usuarioId: number): Promise<boolean> => {
      try {
        await asignacionesService.quitar(sucursalId, usuarioId);
        toast.success("Usuario desvinculado correctamente");
        return true;
      } catch {
        toast.error("Error al desvincular usuario");
        return false;
      }
    },
    [],
  );

  return { asignar, quitar }; 
};
