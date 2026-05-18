import type { TableColumnsType } from "antd";
import { Download, Eye, RotateCcw, Trash2 } from "lucide-react";

import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";

import {
  ARCHIVO_BASE_COLUMNS,
  type ArchivoResource,
} from "./archivo.constants";

interface Props {
  data: ArchivoResource[];
  loading: boolean;
  mode?: "activos" | "papelera";
  restoringId?: number | null;
  forceDeletingId?: number | null;
  onView: (item: ArchivoResource) => void;
  onDownload: (item: ArchivoResource) => void;
  onDelete?: (item: ArchivoResource) => void;
  onRestore?: (item: ArchivoResource) => void;
  onForceDelete?: (item: ArchivoResource) => void;
}

export const ArchivoTable = ({
  data,
  loading,
  mode = "activos",
  restoringId,
  forceDeletingId,
  onView,
  onDownload,
  onDelete,
  onRestore,
  onForceDelete,
}: Props) => {
  const columns: TableColumnsType<ArchivoResource> = [
    ...ARCHIVO_BASE_COLUMNS,
    {
      title: "",
      width: 100,
      render: (_, record) => (
        <RowActions
          actions={
            mode === "papelera"
              ? [
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
                    key: "restore",
                    label:
                      restoringId === record.id
                        ? "Restaurando..."
                        : "Restaurar",
                    icon: <RotateCcw size={14} />,
                    permission: "sucursales.editar",
                    onClick: () => onRestore?.(record),
                  },
                  {
                    key: "force-delete",
                    label:
                      forceDeletingId === record.id
                        ? "Eliminando..."
                        : "Eliminar permanente",
                    icon: <Trash2 size={14} />,
                    danger: true,
                    permission: "sucursales.eliminar",
                    onClick: () => onForceDelete?.(record),
                  },
                ]
              : [
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
                    permission: "sucursales.eliminar",
                    onClick: () => onDelete?.(record),
                  },
                ]
          }
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
