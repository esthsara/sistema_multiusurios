import { Tag, Badge } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Eye } from "lucide-react";

import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";

import { ACCION_COLOR, type AuditoriaItem } from "./auditoria.constants";

interface Props {
  data: AuditoriaItem[];
  loading: boolean;
  onView: (item: AuditoriaItem) => void;
  pagination?: TableProps<AuditoriaItem>["pagination"];
}

export const AuditoriaTable = ({
  data,
  loading,
  onView,
  pagination,
}: Props) => {
  const columns: TableColumnsType<AuditoriaItem> = [
    {
      title: "Registro",
      responsive: ["xs"],
      render: (_, r) => (
        <div className="space-y-1 py-1">
          <div className="flex items-center justify-between gap-2">
            <Tag color={ACCION_COLOR[r.accion] ?? "default"} className="m-0">
              {r.accion_texto}
            </Tag>
            <span
              className="text-[11px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {r.created_at_humano}
            </span>
          </div>
          <p
            className="text-sm font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {r.usuario.nombre}
          </p>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.entidad_nombre} • IP: {r.ip ?? "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Fecha",
      width: 140,
      responsive: ["sm"],
      render: (_, r) => (
        <div>
          <p
            className="text-xs m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {r.fecha}
          </p>
          <span
            className="text-[11px]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.created_at_humano}
          </span>
        </div>
      ),
    },
    {
      title: "Usuario",
      width: 180,
      responsive: ["md"],
      render: (_, r) => (
        <div>
          <p
            className="text-sm font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {r.usuario.nombre}
          </p>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.usuario.email}
          </span>
        </div>
      ),
    },
    {
      title: "Acción",
      width: 160,
      responsive: ["sm"],
      render: (_, r) => (
        <Tag
          color={ACCION_COLOR[r.accion] ?? "default"}
          className="m-0 px-3 py-0.5 rounded-full"
        >
          {r.accion_texto}
        </Tag>
      ),
    },
    {
      title: "Entidad",
      width: 130,
      responsive: ["lg"],
      render: (_, r) => <Badge status="processing" text={r.entidad_nombre} />,
    },
    {
      title: "IP",
      width: 120,
      responsive: ["xl"],
      render: (_, r) => (
        <span
          className="text-xs font-mono"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.ip ?? "—"}
        </span>
      ),
    },
    {
      title: "",
      width: 80,
      render: (_, record) => (
        <RowActions
          actions={[
            {
              key: "view",
              label: "Ver",
              icon: <Eye size={14} />,
              onClick: () => onView(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableSimple
      rowKey="id"
      dataSource={data}
      columns={columns}
      loading={loading}
      pagination={pagination ?? { pageSize: 8, showSizeChanger: false }}
      scroll={{ x: 980 }}
      locale={{ emptyText: "No hay registros de auditoría" }}
    />
  );
};
