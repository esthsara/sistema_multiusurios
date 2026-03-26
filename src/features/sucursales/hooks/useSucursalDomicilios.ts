import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalDomiciliosService } from "../services/sucursal-domicilios.service";
import type { SucursalDomicilio } from "../types/sucursal.types";

export const useSucursalDomicilios = (sucursalId: number) => {
  const [domicilios, setDomicilios] = useState<SucursalDomicilio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalDomiciliosService.getBySucursal(sucursalId);
      setDomicilios(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar domicilios de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { domicilios, loading, refetch: fetch };
};
