import { Button, Tooltip } from "antd";
import { Can } from "@/shared/components/guards/Can";
import type { TableColumnsType } from "antd";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { AppTag } from "@/shared/components/atoms/AppTag";

import { type Domicilio } from "./domicilio.constants";

interface Props {
  data: Domicilio[];
  loading: boolean;
  markingPrincipalId: number | null;
  onMarkPrincipal: (item: Domicilio) => void;
  onView: (item: Domicilio) => void;
  onEdit: (item: Domicilio) => void;
  onDelete: (item: Domicilio) => void;
}

export const DomicilioTable = ({
  data,
  loading,
  markingPrincipalId,
  onMarkPrincipal,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TableColumnsType<Domicilio> = [
    {
      title: "Tipo",
      key: "tipo",
      width: 110,
      render: (_, r) => (
        <AppTag
          tone={
            r.tipo === "FISCAL"
              ? "primary"
              : r.tipo === "PARTICULAR"
                ? "cyan"
                : r.tipo === "ENTREGA"
                  ? "purple"
                  : "neutral"
          }
        >
          {r.tipo_texto}
        </AppTag>
      ),
    },
    { title: "País", dataIndex: "pais", width: 100 },
    { title: "Ciudad", dataIndex: "ciudad", width: 120 },
    { title: "Dirección", dataIndex: "direccion" },
    { title: "C.P.", dataIndex: "codigo_postal", width: 80 },
    {
      title: "Principal",
      key: "principal",
      width: 170,
      render: (_, r) =>
        r.principal ? (
          <AppTag tone="gold">Principal</AppTag>
        ) : (
          <Can permission="personas.editar">
            <Tooltip title="Marcar como principal">
              <Button
                size="small"
                type="text"
                icon={<Star size={14} />}
                className="rounded-lg"
                style={{
                  backgroundColor: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                }}
                loading={markingPrincipalId === r.id}
                onClick={() => onMarkPrincipal(r)}
              ></Button>
            </Tooltip>
          </Can>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <RowActions
          actions={[
            {
              key: "view",
              label: "Ver",
              icon: <Eye size={14} />,
              onClick: () => onView(record),
            },
            {
              key: "edit",
              label: "Editar",
              icon: <Pencil size={14} />,
              permission: "personas.editar",
              onClick: () => onEdit(record),
            },
            {
              key: "delete",
              label: "Eliminar",
              icon: <Trash2 size={14} />,
              danger: true,
              permission: "personas.eliminar",
              onClick: () => onDelete(record),
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
    />
  );
};
