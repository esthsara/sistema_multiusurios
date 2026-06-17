import { Button, Input, Select } from "antd";
import { RotateCcw, Search } from "lucide-react";
import type { SucursalFilters } from "@/features/sucursales/types/sucursal.types";

interface SucursalFiltersProps {
  filters: SucursalFilters;
  search: string;
  onSearch: (value: string) => void;
  onFilter: (filters: Partial<SucursalFilters>) => void;
  onReset: () => void;
}

export const SucursalFiltersBar = ({
  filters,
  search,
  onSearch,
  onFilter,
  onReset,
}: SucursalFiltersProps) => {
  const estadoValue =
    filters.activa === true
      ? "ACTIVA"
      : filters.activa === false
        ? "INACTIVA"
        : undefined;

  return (
    <div
      className="flex flex-wrap items-center gap-3 mb-4 p-4"
      style={{
        background: "var(--color-bg-base-2)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Input
        prefix={
          <Search size={15} style={{ color: "var(--color-primary-400)" }} />
        }
        placeholder="Buscar sucursal..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        style={{ width: 280 }}
      />

      <Select
        placeholder="Estado"
        value={estadoValue}
        onChange={(value) => {
          if (!value) {
            onFilter({ activa: "" });
            return;
          }
          onFilter({ activa: value === "ACTIVA" });
        }}
        allowClear
        style={{ width: 160 }}
        options={[
          { value: "ACTIVA", label: "✓ Activa" },
          { value: "INACTIVA", label: "✗ Inactiva" },
        ]}
      />

      <div style={{ flex: 1 }} />

      <Button icon={<RotateCcw size={14} />} onClick={onReset}>
        Limpiar
      </Button>
    </div>
  );
};
