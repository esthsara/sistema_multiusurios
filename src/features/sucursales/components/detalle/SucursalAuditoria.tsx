import { useCallback, useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { auditoriaService } from "@/features/auditoria/services/auditoria.service";
import type { AuditoriaListItem } from "@/features/auditoria/types/auditoria.types";

interface SucursalAuditoriaProps {
  sucursalId: number;
}

export const SucursalAuditoria = ({ sucursalId }: SucursalAuditoriaProps) => {
  const [items, setItems] = useState<AuditoriaListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditoriaService.getAll({
        entidad_id: sucursalId,
        entidad_type: "Sucursal",
        per_page: 100,
      });
      setItems(res.data);
    } catch {
      toast.error("Error al cargar auditoría de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns: TableColumnsType<AuditoriaListItem> = [
    { title: "Fecha", dataIndex: "fecha", key: "fecha", width: 160 },
    {
      title: "Usuario",
      key: "usuario",
      render: (_, r) => (
        <span>
          {r.usuario.nombre} ({r.usuario.email})
        </span>
      ),
    },
    {
      title: "Acción",
      key: "accion",
      width: 180,
      render: (_, r) => <Tag>{r.accion_texto ?? r.accion}</Tag>,
    },
    { title: "IP", dataIndex: "ip", key: "ip", width: 140 },
  ];

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          icon={<RefreshCcw size={14} />}
          onClick={fetch}
          loading={loading}
        >
          Refrescar
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={items}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
