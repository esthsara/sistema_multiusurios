import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useTableState } from "@/shared/hooks/useTableState";
import { sessionsService } from "../services/sessions.service";
import type { SessionItem, SessionsFilters } from "../types/sessions.types";

export const useSessions = () => {
  const [data, setData] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const requestIdRef = useRef(0);

  const table = useTableState<SessionsFilters>({
    search: "",
    dispositivo: "",
    activa: "",
    fecha_desde: "",
    fecha_hasta: "",
  });

  const fetchSessions = useCallback(async () => {
    const reqId = ++requestIdRef.current;
    
    setLoading(true);
    try {
      
      const res = await sessionsService.getAll();

      if (reqId !== requestIdRef.current) {
        return;
      }

      const items = res.data ?? [];
      setData(items);
    } catch (err) {
     
      if (reqId === requestIdRef.current)
        toast.error("Error al cargar sesiones");
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
   
    const timer = window.setTimeout(() => {
      
      fetchSessions();
    }, 250);

    return () => {
      
      window.clearTimeout(timer);
    };
  }, [fetchSessions]);

  const filtered = useMemo(() => {
    const search = (table.state.search ?? "").toString().trim().toLowerCase();
    const dispositivo = (table.state.filters.dispositivo ?? "").toString();
    const activa = (table.state.filters.activa ?? "").toString();
    const fechaDesde = table.state.filters.fecha_desde ?? "";
    const fechaHasta = table.state.filters.fecha_hasta ?? "";

    return data.filter((s) => {
      if (search) {
        const username = s.currentToken?.tokenable?.username ?? "";
        const email = s.currentToken?.tokenable?.email ?? "";
        const device = s.dispositivo ?? "";
        const ip = s.ip ?? "";
        const hay = `${username} ${email} ${device} ${ip}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }

      if (dispositivo && dispositivo !== "") {
        if ((s.dispositivo ?? "").toLowerCase() !== dispositivo.toLowerCase()) {
          return false;
        }
      }

      if (activa && activa !== "") {
        const activoStr = s.activa ? "true" : "false";
        if (activoStr !== activa) return false;
      }

      if ((fechaDesde || fechaHasta) && s.login_at) {
        const login = dayjs(s.login_at);
        if (fechaDesde) {
          const from = dayjs(fechaDesde, "YYYY-MM-DD");
          if (login.isBefore(from, "day")) return false;
        }
        if (fechaHasta) {
          const to = dayjs(fechaHasta, "YYYY-MM-DD").endOf("day");
          if (login.isAfter(to)) return false;
        }
      }

      return true;
    });
  }, [data, table.state.search, table.state.filters]);

  const total = filtered.length;

  const revokeAll = useCallback(async () => {
    setRevoking(true);
    try {
      const res = await sessionsService.revokeAll();
      const revoked = res.data?.sessions_revoked ?? 0;
      toast.success(`${revoked} sesiones cerradas`);
      await fetchSessions();
      return true;
    } catch {
      toast.error("Error al cerrar sesiones");
      return false;
    } finally {
      setRevoking(false);
    }
  }, [fetchSessions]);

  return {
    data,
    filtered,
    total,
    loading,
    revoking,
    table,
    fetchSessions,
    revokeAll,
  };
};

export default useSessions;
