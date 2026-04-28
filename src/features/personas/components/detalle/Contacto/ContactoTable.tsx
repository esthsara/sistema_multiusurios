import type { TableColumnsType } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { type Contacto } from "./contacto.constants";

interface Props {
  data: Contacto[];
  loading: boolean;
  onView: (item: Contacto) => void;
  onEdit: (item: Contacto) => void;
  onDelete: (item: Contacto) => void;
}

export const ContactoTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TableColumnsType<Contacto> = [
    {
      title: "Tipo",
      width: 120,
      render: (_, r) => (
        <AppTag
          tone={
            r.tipo === "EMAIL"
              ? "primary"
              : r.tipo === "TELEFONO"
                ? "success"
                : "neutral"
          }
        >
          {r.tipo_texto}
        </AppTag>
      ),
    },
    {
      title: "Valor",
      dataIndex: "valor",
    },
    {
      title: "Fecha",
      width: 130,
      render: (_, r) => (
        <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
          {r.created_at.slice(0, 10)}
        </span>
      ),
    },
    {
      title: "",
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
