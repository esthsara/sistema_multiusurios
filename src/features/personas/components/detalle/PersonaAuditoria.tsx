// src/features/personas/components/detalle/PersonaAuditoria.tsx
import { useState, useEffect, useCallback } from "react";
import { Table, Tag, Badge, Button } from "antd";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import type { TableColumnsType } from "antd";
import { http } from "@/shared/services/http.service";
import type { AuditoriaItem } from "../../types/persona-detalle.types";

interface PersonaAuditoriaProps {
  personaId: number;
}

const ACCION_COLOR: Record<string, string> = {
  LOGIN_SUCCESS: "green",
  LOGOUT: "orange",
  CREATE: "blue",
  UPDATE: "cyan",
  DELETE: "red",
};

export const PersonaAuditoria = ({ personaId }: PersonaAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.getPaginated<AuditoriaItem>("/auditoria", {
        entidad_id: personaId,
        page,
        per_page: 10,
      });
      setItems(res.data);
      setTotal(res.meta.total);
    } catch {
      toast.error("Error al cargar auditoría");
    } finally {
      setLoading(false);
    }
  }, [personaId, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns: TableColumnsType<AuditoriaItem> = [
    {
      title: "Fecha",
      key: "fecha",
      width: 130,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.fecha}
        </span>
      ),
    },
    {
      title: "Usuario",
      key: "usuario",
      width: 150,
      render: (_, r) => (
        <div>
          <p
            className="text-sm font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {r.usuario.nombre}
          </p>
          <p
            className="text-xs m-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.usuario.email}
          </p>
        </div>
      ),
    },
    {
      title: "Acción",
      key: "accion",
      width: 140,
      render: (_, r) => (
        <Tag color={ACCION_COLOR[r.accion] ?? "default"}>{r.accion_texto}</Tag>
      ),
    },
    {
      title: "Entidad",
      key: "entidad",
      width: 100,
      render: (_, r) => <Badge status="default" text={r.entidad_nombre} />,
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: 110,
      render: (ip) => (
        <span
          className="text-xs font-mono"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {ip}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          icon={<RotateCcw size={14} />}
          onClick={fetch}
          loading={loading}
          size="small"
        >
          Refrescar
        </Button>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        loading={loading}
        size="small"
        scroll={{ x: 700 }}
        pagination={{
          current: page,
          pageSize: 10,
          total,
          onChange: setPage,
          showTotal: (t, r) => `${r[0]}-${r[1]} de ${t}`,
        }}
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />
    </div>
  );
};
