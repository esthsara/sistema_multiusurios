import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useSucursalContactos } from "../../hooks/useSucursalContactos";
import type { SucursalContacto as SucursalContactoItem } from "../../types/sucursal.types";

interface SucursalContactoProps {
  sucursalId: number;
}

export const SucursalContacto = ({ sucursalId }: SucursalContactoProps) => {
  const { contactos, loading } = useSucursalContactos(sucursalId);

  const columns: TableColumnsType<SucursalContactoItem> = [
    {
      title: "Tipo",
      dataIndex: "tipo_texto",
      key: "tipo",
      width: 120,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (text) => (
        <span style={{ color: "var(--color-text-primary)" }}>{text}</span>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 130,
      render: (date) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h3
        className="font-semibold text-base mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Contactos de Sucursal
      </h3>

      <Table
        rowKey="id"
        dataSource={contactos}
        columns={columns}
        loading={loading}
        pagination={false}
        size="small"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />
    </div>
  );
};
