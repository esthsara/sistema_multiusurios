import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { sucursalesService } from "../services/sucursales.service";
import { asignacionesService } from "../services/asignaciones.service";
import type { SucursalDetalle } from "../types/sucursal.types";

export const useSucursalDetalle = (id: number) => {
  const [sucursal, setSucursal] = useState<SucursalDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSucursal = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalesService.getById(id);
      setSucursal(res.data);
    } catch {
      toast.error("Error al cargar la sucursal");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSucursal();
  }, [fetchSucursal]);

  const quitarUsuario = async (usuarioId: number) => {
    try {
      await asignacionesService.quitar(usuarioId, id);
      toast.success("Usuario removido de la sucursal");
      fetchSucursal();
    } catch {
      toast.error("Error al remover usuario");
    }
  };

  const asignarUsuario = async (usuarioId: number) => {
    try {
      await asignacionesService.asignar({
        usuario_id: usuarioId,
        sucursal_id: id,
      });
      toast.success("Usuario asignado correctamente");
      fetchSucursal();
    } catch {
      toast.error("Error al asignar usuario");
    }
  };

  return {
    sucursal,
    loading,
    refetch: fetchSucursal,
    quitarUsuario,
    asignarUsuario,
  };
};
