import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Tag } from "antd";
import { Activity, Clock3, RotateCcw, UserCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import { http } from "@/shared/services/http.service";

import { AuditoriaTable } from "./Auditoria/AuditoriaTable";
import { AuditoriaViewModal } from "./Auditoria/AuditoriaViewModal";
import type { AuditoriaItem } from "./Auditoria/auditoria.constants";

interface Props {
  personaId: number;
}

export const PersonaAuditoria = ({ personaId }: Props) => {
  const [items, setItems] = useState<AuditoriaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AuditoriaItem | null>(null);

  const stats = useMemo(() => {
    const uniqueUsers = new Set(items.map((item) => item.usuario.id)).size;
    const lastItem = items[0] ?? null;

    return {
      total: items.length,
      users: uniqueUsers,
      lastAction: lastItem?.accion_texto ?? "Sin registros",
      lastWhen: lastItem?.created_at_humano ?? "—",
    };
  }, [items]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get<{ items: AuditoriaItem[] }>("/auditoria", {
        entidad_id: personaId,
        per_page: 10,
      });

      setItems(res.data.items);
    } catch {
      toast.error("Error al cargar auditoría");
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(168,85,247,0.08))",
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
              Seguimiento de acciones realizadas sobre esta persona.
            </p>
          </div>

          <Button
            icon={<RotateCcw size={14} />}
            onClick={fetch}
            loading={loading}
            size="middle"
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
                Usuarios
              </span>
              <UserCircle2
                size={14}
                style={{ color: "var(--color-primary-500)" }}
              />
            </div>
            <p className="text-lg font-semibold m-0 mt-1">{stats.users}</p>
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

      <AuditoriaTable data={items} loading={loading} onView={setSelected} />

      <AuditoriaViewModal
        open={!!selected}
        item={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
