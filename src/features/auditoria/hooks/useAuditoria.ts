import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTableState } from "@/shared/hooks/useTableState";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import type { RequestParams } from "@/shared/types/api.types";
import { auditoriaService } from "../services/auditoria.service";
import type {
  AuditoriaDetalle,
  AuditoriaFilters,
  AuditoriaListItem,
  AuditoriaViewMode,
  EntidadAuditoria,
} from "../types/auditoria.types";

interface UsuarioFilterOption {
  value: number;
  label: string;
}

const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const escapeCsv = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  };

  const headerRow = headers.join(",");
  const body = rows
    .map((row) => headers.map((header) => escapeCsv(row[header])).join(","))
    .join("\n");

  return `${headerRow}\n${body}`;
};

export const useAuditoria = () => {
  const [data, setData] = useState<AuditoriaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [viewMode, setViewMode] = useState<AuditoriaViewMode>("timeline");

  const [acciones, setAcciones] = useState<string[]>([]);
  const [entidades, setEntidades] = useState<EntidadAuditoria[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioFilterOption[]>([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<AuditoriaDetalle | null>(
    null,
  );

  const table = useTableState<AuditoriaFilters>({
    usuario_id: "",
    accion: "",
    entidad_type: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const fetchAuditoria = useCallback(async () => {
    setLoading(true);
    try {
      const params = table.toParams() as RequestParams;
      const res = await auditoriaService.getAll(params);
      setData(res.data);
      setTotal(res.meta.total);
    } catch {
      toast.error("Error al cargar auditoría");
    } finally {
      setLoading(false);
    }
  }, [table.toParams]);

  const fetchCatalogs = useCallback(async () => {
    try {
      const [accionesRes, entidadesRes, usuariosRes] = await Promise.all([
        auditoriaService.getAcciones(),
        auditoriaService.getEntidades(),
        usuariosService.getAll({ page: 1, per_page: 200 }),
      ]);

      setAcciones(accionesRes.data.map((item) => item.value));
      setEntidades(entidadesRes.data);
      setUsuarios(
        usuariosRes.data.map((user) => ({
          value: user.id,
          label: `${user.username} (${user.email})`,
        })),
      );
    } catch {
      // silencioso para no bloquear tabla principal
    }
  }, []);

  useEffect(() => {
    fetchAuditoria();
  }, [fetchAuditoria]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const openDetail = useCallback(async (id: number) => {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      const res = await auditoriaService.getById(id);
      setSelectedDetail(res.data);
    } catch {
      toast.error("No se pudo cargar el detalle de auditoría");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedDetail(null);
  }, []);

  const exportar = useCallback(async () => {
    try {
      setExporting(true);
      const params = table.toParams() as RequestParams;
      const response = await auditoriaService.exportar(params);
      const rows = response.data.data.map((item) => ({
        id: item.id,
        fecha: item.fecha,
        usuario: item.usuario,
        email: item.email,
        accion: item.accion,
        entidad: item.entidad,
        entidad_id: item.entidad_id,
        ip: item.ip,
        cambios: item.cambios,
      }));

      const csv = toCsv(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${response.data.total} registros exportados`);
    } catch {
      toast.error("Error al exportar auditoría");
    } finally {
      setExporting(false);
    }
  }, [table.toParams]);

  const timelineGroups = useMemo(() => {
    const groupMap = new Map<string, AuditoriaListItem[]>();

    data.forEach((item) => {
      const dateKey = item.created_at.slice(0, 10);
      const current = groupMap.get(dateKey) ?? [];
      current.push(item);
      groupMap.set(dateKey, current);
    });

    return Array.from(groupMap.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([date, items]) => ({ date, items }));
  }, [data]);

  return {
    data,
    total,
    loading,
    exporting,
    viewMode,
    setViewMode,
    table,
    acciones,
    entidades,
    usuarios,
    detailOpen,
    detailLoading,
    selectedDetail,
    timelineGroups,
    fetchAuditoria,
    openDetail,
    closeDetail,
    exportar,
  };
};
