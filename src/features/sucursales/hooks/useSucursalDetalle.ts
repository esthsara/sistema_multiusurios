import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import type { SucursalDetalle } from "@/features/sucursales/types/sucursal.types";

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

  return {
    sucursal,
    loading,
    refetch: fetchSucursal,
  };
};
