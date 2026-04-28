import { Button, DatePicker, Input, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { RotateCcw, Search } from "lucide-react";
import type { RolFilters } from "../types/rol.types";

interface RoleFiltersProps {
  search: string;
  filters: RolFilters;
  onSearch: (value: string) => void;
  onFilterChange: (filters: Partial<RolFilters>) => void;
  onReset: () => void;
}

const toDateValue = (value?: string) => {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
};

const toApiDate = (date: Dayjs | null) => {
  if (!date) return "";
  return date.format("YYYY-MM-DD");
};

export const RoleFilters = ({
  search,
  filters,
  onSearch,
  onFilterChange,
  onReset,
}: RoleFiltersProps) => {
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
        placeholder="Buscar por nombre de rol"
        value={search}
        onChange={(e) => onSearch(e.target.value.trimStart())}
        allowClear
        prefix={
          <Search size={15} style={{ color: "var(--color-primary-400)" }} />
        }
        style={{ width: 280 }}
      />

      <Select
        placeholder="Estado"
        value={filters.estado || undefined}
        options={[
          { label: "Activos", value: "activo" },
          { label: "Inactivos", value: "inactivo" },
        ]}
        allowClear
        style={{ width: 160 }}
        onChange={(value) => onFilterChange({ estado: value || "" })}
      />

      <DatePicker.RangePicker
        value={[
          toDateValue(filters.fecha_desde),
          toDateValue(filters.fecha_hasta),
        ]}
        format="DD/MM/YYYY"
        allowEmpty={[true, true]}
        onChange={(dates) =>
          onFilterChange({
            fecha_desde: toApiDate(dates?.[0] ?? null),
            fecha_hasta: toApiDate(dates?.[1] ?? null),
          })
        }
      />

      <div style={{ flex: 1 }} />

      <Button icon={<RotateCcw size={14} />} onClick={onReset}>
        Limpiar
      </Button>
    </div>
  );
};
