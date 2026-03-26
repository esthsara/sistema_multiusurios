// src/features/usuarios/hooks/useSucursalesOptions.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import type { SucursalListItem } from "@/features/sucursales/types/sucursal.types";

interface SucursalOption {
  label: string;
  value: number;
}

/**
 * Hook para cargar TODAS las sucursales disponibles en el sistema
 * Se utiliza principalmente en filtros
 */
export const useSucursalesOptions = () => {
  const [sucursales, setSucursales] = useState<SucursalListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSucursales = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar todas las sucursales sin límite de paginación
      const res = await sucursalesService.getAll({ per_page: 1000 });
      setSucursales(res.data);
    } catch {
      toast.error("Error al cargar sucursales");
      setSucursales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  const branchOptions: SucursalOption[] = sucursales.map((sucursal) => ({
    label: sucursal.nombre,
    value: sucursal.id,
  }));

  return { branchOptions, sucursales, loading, refetch: fetchSucursales };
};
