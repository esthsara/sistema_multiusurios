// src/shared/components/organisms/DataTable.tsx
import { Table, Empty } from "antd";
import type { TableProps } from "antd";
import type { DataTableProps } from "@/shared/types/table.types";


/**
 * DataTable<T> — Tabla genérica reutilizable con soporte light/dark mode
 * T extends object — restricción para garantizar que T es un objeto
 * y que podemos usarlo como tipo de dato de la tabla.
 *
 * Características:
 * • Colores usando variables CSS globales (compatibles con light/dark mode)
 * • Primera columna optimizada para avatares/fotos (60px)
 * • Hover effect en filas
 * • Responsive (mobile, tablet, desktop)
 * • Paginación mejorada
 */

export const DataTable = <T extends object>({
  data,
  columns,
  rowKey,
  loading = false,
  pagination,
  emptyText = "No hay datos disponibles",
  scrollX = 800,
  onRowClick,
  onSortChange,
}: DataTableProps<T>) => {
  const safeData = Array.isArray(data) ? data : [];

  const handleTableChange: TableProps<T>["onChange"] = (
    _pagination,
    _filters,
    sorter,
    extra,
  ) => {
    if (!onSortChange) return;
    if (extra.action !== "sort") return;

    const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!currentSorter?.order) {
      onSortChange(null);
      return;
    }

    const field = String(currentSorter.field ?? currentSorter.columnKey ?? "");
    if (!field) {
      onSortChange(null);
      return;
    }

    onSortChange({
      field,
      direction: currentSorter.order === "ascend" ? "asc" : "desc",
    });
  };

  return (
    <Table<T>
      className="app-data-table"
      dataSource={safeData}
      columns={columns}
      rowKey={rowKey as string}
      loading={loading}
      size="middle"
      scroll={{ x: scrollX }}
      onChange={handleTableChange}
      onRow={
        onRowClick
          ? (record) => ({
              onClick: () => onRowClick(record),
              className: "cursor-pointer",
              style: {
                transition: "all var(--transition-base)",
              },
            })
          : undefined
      }
      pagination={
        pagination
          ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              onShowSizeChange: pagination.onChange,
              showSizeChanger: true,
              responsive: true,
              showLessItems: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} registros`,
              pageSizeOptions: ["6", "12", "24", "48"],
            }
          : false
      }
      locale={{
        emptyText: (
          <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ),
      }}
      style={{
        backgroundColor: "var(--color-bg-base-2)",
        borderRadius: "var(--radius-lg)",
      }}
    />
  );
};