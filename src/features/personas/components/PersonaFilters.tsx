import { Input, Select, Button } from "antd";
import { Search, RotateCcw } from "lucide-react";
import type { PersonaFilters } from "../types/persona.types";

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
          color: "var(--color-primary-400)",
        }}
        options={[
          { value: "FISICA", label: "Física" },
          { value: "MORAL", label: "Moral" },
        ]}
      />

      {/* Estado */}
      <Select
        placeholder="Estado"
        value={filters.estado || undefined}
        onChange={(val) => onFilter({ estado: val })}
        allowClear
        style={{
          width: 140,
          color: "var(--color-primary-400)",
          background: "var(--color-bg-filter)",
        }}
        options={[
          { value: "ACTIVO", label: "✓ Activo" },
          { value: "INACTIVO", label: "✗ Inactivo" },
        ]}
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
