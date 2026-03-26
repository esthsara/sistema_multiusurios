import { Input, Select, Button, DatePicker } from "antd";
import { Search, RotateCcw } from "lucide-react";
import dayjs from "dayjs";
import type { PersonaFilters } from "../types/persona.types";
import "@/index.css";
interface PersonaFiltersProps {
  filters: PersonaFilters;
  search: string;
  onSearch: (value: string) => void;
  onFilter: (filters: Partial<PersonaFilters>) => void;
  onReset: () => void;
}

export const PersonaFiltersBar = ({
  filters,
  search,
  onSearch,
  onFilter,
  onReset,
}: PersonaFiltersProps) => {
  const selectedDate =
    filters.fecha_desde &&
    filters.fecha_hasta &&
    filters.fecha_desde === filters.fecha_hasta
      ? dayjs(filters.fecha_desde)
      : null;

  return (
    <div
      className="persona-filters flex flex-wrap items-center gap-3 mb-4 p-4"
      style={{
        background: "var(--color-bg-base-2)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Buscador */}
      <Input
        prefix={
          <Search
            size={15}
            style={{
              color: "var(--color-primary-400)",
            }}
          />
        }
        placeholder="Buscar persona..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        style={{
          width: 260,
        }}
      />

      {/* Tipo */}
      <Select
        placeholder="Tipo de persona"
        value={filters.tipo_persona || undefined}
        onChange={(val) => onFilter({ tipo_persona: val })}
        allowClear
        style={{
          width: 140,
          background: "var(--color-bg-filter)",
        }}
        options={[
          { value: "FISICA", label: "Física" },
          { value: "MORAL", label: "Moral" },
        ]}
      />

      {/* Estado */}
      <Select
        className="estado-placeholder"
        placeholder="Estado"
        value={filters.estado || undefined}
        onChange={(val) => onFilter({ estado: val })}
        allowClear
        style={{
          width: 140,
          background: "var(--color-bg-filter)",
        }}
        options={[
          { value: "ACTIVO", label: "✓ Activo" },
          { value: "INACTIVO", label: "✗ Inactivo" },
        ]}
      />

      {/* Fecha de registro */}
      <DatePicker
        placeholder="Fecha de registro"
        value={selectedDate}
        allowClear
        format="YYYY-MM-DD"
        onChange={(date) => {
          const value = date ? date.format("YYYY-MM-DD") : "";
          onFilter({ fecha_desde: value, fecha_hasta: value });
        }}
        style={{
          width: 170,
          background: "var(--color-bg-filter)",
        }}
      />

      {/* Spacer automático */}
      <div style={{ flex: 1 }} />

      {/* Botón limpiar */}
      <Button icon={<RotateCcw size={14} />} onClick={onReset} type="default">
        Limpiar
      </Button>
    </div>
  );
};
