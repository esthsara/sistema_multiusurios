import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalContactosService } from "../services/sucursal-contactos.service";
import type { SucursalContacto } from "../types/sucursal.types";

export const useSucursalContactos = (sucursalId: number) => {
  const [contactos, setContactos] = useState<SucursalContacto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalContactosService.getBySucursal(sucursalId);
      setContactos(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar contactos de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { contactos, loading, refetch: fetch };
};
