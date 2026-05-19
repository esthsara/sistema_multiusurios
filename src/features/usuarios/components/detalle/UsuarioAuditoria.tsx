// src/features/usuarios/components/detalle/UsuarioAuditoria.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "antd";
import { Activity, Clock3, RotateCcw, UserCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { auditoriaService } from "@/features/auditoria/services/auditoria.service";
import type { AuditoriaListItem } from "@/features/auditoria/types/auditoria.types";
import { AppTag } from "@/shared/components/atoms/AppTag";

import { AuditoriaTable } from "./Auditoria/AuditoriaTable";
import { AuditoriaViewModal } from "./Auditoria/AuditoriaViewModal";

interface UsuarioAuditoriaProps {
  usuarioId: number;
}

export const UsuarioAuditoria = ({ usuarioId }: UsuarioAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AuditoriaListItem | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
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
        usuario_id: usuarioId,
        page,
        per_page: pageSize,
      });
      setItems(res.data);
      setTotal(res.meta.total);
    } catch {
      toast.error("Error al cargar auditoría");
    } finally {
      setLoading(false);
    }
  }, [usuarioId, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.10), rgba(168,85,247,0.08))",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              className="text-base font-semibold m-0"
              style={{ color: "var(--color-text-primary)" }}
            >
              Historial de auditoría
            </h3>
            <p
              className="text-xs m-0 mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Seguimiento de acciones realizadas por este usuario.
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
              <UserCircle2
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
              <AppTag tone="geekblue">{stats.lastAction}</AppTag>
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
