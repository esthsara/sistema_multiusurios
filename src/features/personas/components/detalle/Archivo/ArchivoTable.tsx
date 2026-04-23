import type { TableColumnsType } from "antd";
import { Download, Eye, Trash2 } from "lucide-react";

import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";

import {
  ARCHIVO_BASE_COLUMNS,
  type ArchivoResource,
} from "./archivo.constants";

interface Props {
  data: ArchivoResource[];
  loading: boolean;
  onView: (item: ArchivoResource) => void;
  onDownload: (item: ArchivoResource) => void;
  onDelete: (item: ArchivoResource) => void;
}

export const ArchivoTable = ({
  data,
  loading,
  onView,
  onDownload,
  onDelete,
}: Props) => {
  const columns: TableColumnsType<ArchivoResource> = [
    ...ARCHIVO_BASE_COLUMNS,
    {
      title: "",
      width: 100,
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
              key: "download",
              label: "Descargar",
              icon: <Download size={14} />,
              onClick: () => onDownload(record),
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
