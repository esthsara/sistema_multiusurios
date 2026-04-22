import { Table } from "antd";
import type { TableProps } from "antd";

interface DataTableSimpleProps<T> extends TableProps<T> {
  card?: boolean;
}

export const DataTableSimple = <T extends object>({
  card = true,
  ...props
}: DataTableSimpleProps<T>) => {
  return (
    <div
      style={
        card
          ? {
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
              backdropFilter: "blur(6px)",
            }
          : undefined
      }
    >
      <Table
        {...props}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
          ...props.pagination,
        }}
        size="middle"
        className="datatable-modern"
      />
    </div>
  );
};
