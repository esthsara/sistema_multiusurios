import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Tag } from "antd";
import { Activity, Clock3, RotateCcw, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { auditoriaService } from "@/features/auditoria/services/auditoria.service";
import type { AuditoriaListItem } from "@/features/auditoria/types/auditoria.types";
import dayjs, { type Dayjs } from "dayjs";

import { AuditoriaTable } from "./Auditoria/AuditoriaTable";
import { AuditoriaViewModal } from "./Auditoria/AuditoriaViewModal";

interface SucursalAuditoriaProps {
  sucursalId: number;
}

export const SucursalAuditoria = ({ sucursalId }: SucursalAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AuditoriaListItem | null>(null);
  const pageSize = 8;

  const stats = useMemo(() => {
    const uniqueActions = new Set(items.map((item) => item.accion)).size;
    const lastItem = items[0] ?? null;

    return {
      total,
      actions: uniqueActions,
      lastAction: lastItem?.accion_texto ?? "Sin registros",
      lastWhen: lastItem?.created_at_humano ?? "—",
    };
  }, [items, total]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditoriaService.getAll({
        sucursal_id: sucursalId,
        fecha_inicio: fechaInicio
          ? fechaInicio.format("YYYY-MM-DD")
          : undefined,
        page,
        per_page: pageSize,
      });
      setItems(res.data);
      setTotal(res.meta.total);
    } catch {
      toast.error("Error al cargar auditoría de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId, fechaInicio, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(59,130,246,0.08))",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              className="text-base font-semibold m-0"
              style={{ color: "var(--color-text-primary)" }}
            >
              Historial de sucursal
            </h3>
            <p
              className="text-xs m-0 mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Actividades registradas para esta sucursal.
            </p>
          </div>

          <Button
            icon={<RotateCcw size={14} />}
            onClick={fetch}
            loading={loading}
          >
            Refrescar
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Eventos
              </span>
              <Activity
                size={14}
                style={{ color: "var(--color-primary-500)" }}
              />
            </div>
            <p className="text-lg font-semibold m-0 mt-1">{stats.total}</p>
          </div>

          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Acciones únicas
              </span>
              <Building2
                size={14}
                style={{ color: "var(--color-primary-500)" }}
              />
            </div>
            <p className="text-lg font-semibold m-0 mt-1">{stats.actions}</p>
          </div>

          <div
            className="rounded-lg p-3 sm:col-span-2"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Último evento
              </span>
              <Clock3 size={14} style={{ color: "var(--color-primary-500)" }} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Tag className="m-0">{stats.lastAction}</Tag>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {stats.lastWhen}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
        }}
      >
        <DatePicker
          placeholder="Fecha inicio"
          value={fechaInicio}
          allowClear
          format="YYYY-MM-DD"
          onChange={(value) => {
            setPage(1);
            setFechaInicio(value);
          }}
        />
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Filtra la actividad desde una fecha específica.
        </span>
      </div>

      <AuditoriaTable
        data={items}
        loading={loading}
        onView={setSelected}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />

      <AuditoriaViewModal
        open={!!selected}
        item={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
