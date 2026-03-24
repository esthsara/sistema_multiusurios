// src/shared/components/organisms/DataTable.tsx
import { Table, Empty } from "antd";
import type { DataTableProps } from "@/shared/types/table.types";

/**
 * DataTable<T> — Tabla genérica reutilizable.
 * T extends object — restricción para garantizar que T es un objeto
 * y que podemos usarlo como tipo de dato de la tabla.
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
}: DataTableProps<T>) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Table<T>
      className="app-data-table"
      dataSource={safeData}
      columns={columns}
      rowKey={rowKey as string}
      loading={loading}
      size="middle"
      scroll={{ x: scrollX }}
      onRow={
        onRowClick
          ? (record) => ({
              onClick: () => onRowClick(record),
              className: "cursor-pointer",
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
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} registros`,
              pageSizeOptions: ["10", "20", "50", "100"],
              style: { marginBottom: 0 },
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
        borderRadius: "var(--radius-md)",
      }}
    />
  );
};
