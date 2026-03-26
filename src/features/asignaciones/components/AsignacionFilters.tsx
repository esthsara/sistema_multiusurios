// src/features/asignaciones/components/AsignacionFilters.tsx
import { Input, Select, Button } from "antd";
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
      rol_id: undefined,
      activa: "",
      search: "",
    });
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: "var(--color-bg-elevated)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
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
            disabled={loading}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Sucursal
          </label>
          <Select
            placeholder="Todas"
            value={filters.sucursal_id || undefined}
            onChange={(value) =>
              onFilterChange({ ...filters, sucursal_id: value })
            }
            allowClear
            options={sucursales.map((s) => ({
              value: s.id,
              label: `${s.nombre} (${s.codigo})`,
            }))}
            disabled={loading}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Rol
          </label>
          <Select
            placeholder="Todos"
            value={filters.rol_id || undefined}
            onChange={(value) => onFilterChange({ ...filters, rol_id: value })}
            allowClear
            options={roles.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
            disabled={loading}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Estado
          </label>
          <Select
            placeholder="Todos"
            value={filters.activa === "" ? undefined : filters.activa}
            onChange={(value) =>
              onFilterChange({
                ...filters,
                activa: value === undefined ? "" : value,
              })
            }
            allowClear
            options={[
              { value: true, label: "Activa" },
              { value: false, label: "Inactiva" },
            ]}
            disabled={loading}
            style={{ width: "100%" }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            icon={<RotateCcw size={14} />}
            disabled={loading}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};
