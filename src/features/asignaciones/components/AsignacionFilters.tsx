// src/features/asignaciones/components/AsignacionFilters.tsx

import { Input, Button } from "antd";
import { RotateCcw } from "lucide-react";
import type { AsignacionFilters as AsignacionFiltersType } from "../types/asignacion.types";

type AsignacionFiltersProps = {
  filters: AsignacionFiltersType;
  onFilterChange: (filters: AsignacionFiltersType) => void;
  sucursales?: Array<{ id: number; nombre: string; codigo: string }>;
  roles?: Array<{ id: number; name: string }>;
  loading?: boolean;
};

export const AsignacionFilters = ({
  filters,
  onFilterChange,
  sucursales = [],
  roles = [],
  loading = false,
}: AsignacionFiltersProps) => {
  const handleReset = () => {
    onFilterChange({
      sucursal_id: undefined,
      usuario_id: undefined,
      search: "",
    });
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: "var(--color-bg-elevated)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Buscar
          </label>
          <Input
            placeholder="Usuario, email, sucursal..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            allowClear
          />
        </div>

        <Button
          icon={<RotateCcw size={16} />}
          onClick={handleReset}
          disabled={loading}
          className="w-full"
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
};
        