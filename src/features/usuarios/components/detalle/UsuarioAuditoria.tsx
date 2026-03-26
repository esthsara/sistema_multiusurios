// src/features/usuarios/components/detalle/UsuarioAuditoria.tsx
import { useState, useEffect, useCallback } from "react";
import { Table, Tag } from "antd";
import { toast } from "react-toastify";
import type { TableColumnsType } from "antd";
import { auditoriaService } from "@/features/auditoria/services/auditoria.service";
import type { AuditoriaListItem } from "@/features/auditoria/types/auditoria.types";

interface UsuarioAuditoriaProps {
  usuarioId: number;
}

const ACCION_COLOR: Record<string, string> = {
  LOGIN_SUCCESS: "green",
  LOGOUT: "orange",
  USUARIO_CREADO: "blue",
  USUARIO_ACTUALIZADO: "cyan",
  USUARIO_ACTIVADO: "green",
  USUARIO_DESACTIVADO: "red",
};

export const UsuarioAuditoria = ({ usuarioId }: UsuarioAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditoriaService.getAll({
        usuario_id: usuarioId,
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
  }, [usuarioId, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns: TableColumnsType<AuditoriaListItem> = [
    {
      title: "Fecha",
      key: "fecha",
      width: 150,
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
      title: "Acción",
      key: "accion",
      width: 180,
      render: (_, r) => (
        <Tag color={ACCION_COLOR[r.accion] ?? "default"}>
          {r.accion_texto ?? r.accion}
        </Tag>
      ),
    },
    {
      title: "Entidad",
      key: "entidad",
      width: 120,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.entidad_nombre}
        </span>
      ),
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      width: 120,
      render: (ip: string) => (
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
    <Table
      dataSource={items}
      columns={columns}
      rowKey="id"
      loading={loading}
      size="small"
      scroll={{ x: 600 }}
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
  );
};
