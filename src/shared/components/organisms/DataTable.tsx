// src/shared/components/organisms/DataTable.tsx
import { Table, Empty } from "antd";
import type { DataTableProps } from "@/shared/types/table.types";

/**
 * DataTable<T> — Tabla genérica reutilizable.
 *
 * ¿Por qué un wrapper sobre Table de Ant Design?
 * 1. Estandariza la configuración (locale, scroll, etc.)
 * 2. Si Ant Design cambia su API, solo actualizamos aquí
 * 3. Agrega comportamientos comunes: click en fila, empty state
 *
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
  return (
    <Table<T>
      dataSource={data}
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
        backgroundColor: "var(--color-bg-base)",
        borderRadius: "var(--radius-card)",
      }}
    />
  );
};
