import { useCallback, useEffect, useState } from "react";
import { Button, Table, Tag, Badge, DatePicker } from "antd";
import type { TableColumnsType } from "antd";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { auditoriaService } from "@/features/auditoria/services/auditoria.service";
import type { AuditoriaListItem } from "@/features/auditoria/types/auditoria.types";
import dayjs, { type Dayjs } from "dayjs";

interface SucursalAuditoriaProps {
  sucursalId: number;
}

const ACCION_COLOR: Record<string, string> = {
  LOGIN_SUCCESS: "green",
  LOGOUT: "orange",
  CREATE: "blue",
  UPDATE: "cyan",
  DELETE: "red",
  CONTACTO_CREADO: "blue",
  CONTACTO_ELIMINADO: "red",
  DOMICILIO_CREADO: "gold",
  DOMICILIO_ACTUALIZADO: "cyan",
};

export const SucursalAuditoria = ({ sucursalId }: SucursalAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditoriaService.getAll({
        sucursal_id: sucursalId,
        fecha_inicio: fechaInicio
          ? fechaInicio.format("YYYY-MM-DD")
          : undefined,
        page,
        per_page: 10,
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

  const columns: TableColumnsType<AuditoriaListItem> = [
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
          {ip ?? "-"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-3">
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
