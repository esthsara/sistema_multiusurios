// src/features/matriz/components/MatrizFilters.tsx
import { Button, Input, Select } from "antd";
import { RotateCcw, Search } from "lucide-react";
import type { MatrizFilters } from "../types/matriz.types";

interface MatrizFiltersProps {
  filters: MatrizFilters;
  setFilters: (filters: MatrizFilters) => void;
  modulos: string[];
  roles: Array<{ id: number; name: string }>;
}

export const MatrizFiltersComponent = ({
  filters,
  setFilters,
  modulos,
  roles,
}: MatrizFiltersProps) => {
  return (
    <div
      className="matriz-filters flex flex-wrap items-center gap-3 mb-4 p-4"
      style={{
        background: "var(--color-bg-base-2)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* 🔍 Búsqueda */}
      <Input
        prefix={
          <Search
            size={15}
            style={{ color: "var(--color-primary-400)" }}
          />
        }
        placeholder="Buscar módulo, permiso o acción..."
        value={filters.search ?? ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        allowClear
        style={{ width: 260 }}
      />

      {/* 📂 Módulos */}
      <Select
        mode="multiple"
        placeholder="Filtrar por módulos"
        value={filters.modulos ?? []}
        onChange={(value) => setFilters({ ...filters, modulos: value })}
        options={modulos.map((m) => ({
          label: m.charAt(0).toUpperCase() + m.slice(1),
          value: m,
        }))}
        style={{
          minWidth: 200,
          background: "var(--color-bg-filter)",
        }}
        maxTagCount="responsive"
        allowClear
      />

      {/* 🎯 Foco en un rol */}
      <Select
        placeholder="Ver un rol específico"
        value={filters.selectedRol ?? undefined}
        onChange={(value) =>
          setFilters({ ...filters, selectedRol: value ?? null })
        }
        options={roles.map((r) => ({ label: r.name, value: r.id }))}
        style={{
          width: 220,
          background: "var(--color-bg-filter)",
        }}
        allowClear
      />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* 🧹 Limpiar */}
      <Button
        icon={<RotateCcw size={14} />}
        onClick={() =>
          setFilters({ search: "", modulos: [], roles: [], selectedRol: null })
        }
        type="default"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        Limpiar
      </Button>
    </div>
  );
};