import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useSucursalDomicilios } from "../../hooks/useSucursalDomicilios";
import type { SucursalDomicilio as SucursalDomicilioItem } from "../../types/sucursal.types";

interface SucursalDomicilioProps {
  sucursalId: number;
}

export const SucursalDomicilio = ({ sucursalId }: SucursalDomicilioProps) => {
  const { domicilios, loading } = useSucursalDomicilios(sucursalId);

  const columns: TableColumnsType<SucursalDomicilioItem> = [
    {
      title: "Tipo",
      dataIndex: "tipo_texto",
      key: "tipo",
      width: 120,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciudad",
      width: 130,
    },
    {
      title: "País",
      dataIndex: "pais",
      key: "pais",
      width: 120,
    },
    {
      title: "Código Postal",
      dataIndex: "codigo_postal",
      key: "codigo_postal",
      width: 130,
      render: (text) => (
        <span style={{ color: "var(--color-text-secondary)" }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Principal",
      key: "principal",
      width: 100,
      render: (_, r) => (
        <span style={{ color: "var(--color-text-primary)" }}>
          {r.principal ? "Sí" : "No"}
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
        Domicilios de Sucursal
      </h3>

      <Table
        rowKey="id"
        dataSource={domicilios}
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
