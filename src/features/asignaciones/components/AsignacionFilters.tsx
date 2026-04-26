import { Input, Button, Tag } from "antd";
import { Search, RotateCcw, FilterX } from "lucide-react";
import type { AsignacionFilters as AsignacionFiltersType } from "../types/asignacion.types";

type AsignacionFiltersProps = {
  filters: AsignacionFiltersType;
  onFilterChange: (filters: AsignacionFiltersType) => void;
  loading?: boolean;
};

const hayFiltrosActivos = (f: AsignacionFiltersType) =>
  !!f.search || !!f.sucursal_id || !!f.usuario_id;

export const AsignacionFilters = ({
  filters,
  onFilterChange,
  loading = false,
}: AsignacionFiltersProps) => {
  const activo = hayFiltrosActivos(filters);

  const handleReset = () =>
    onFilterChange({
      sucursal_id: undefined,
      usuario_id: undefined,
      search: "",
    });

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Buscador */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            prefix={
              <Search
                size={15}
                style={{ color: "var(--color-text-secondary)" }}
              />
            }
            placeholder="Buscar por usuario o email..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            allowClear
            disabled={loading}
          />
        </div>

        {/* Botón limpiar — solo visible si hay filtros activos */}
        {activo && (
          <Button
            icon={<FilterX size={15} />}
            onClick={handleReset}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            Limpiar filtros
          </Button>
        )}

        {/* Indicador de filtros activos */}
        {activo && (
          <Tag
            icon={<RotateCcw size={12} />}
            color="blue"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
            onClick={handleReset}
          >
            Filtros activos
          </Tag>
        )}
      </div>
    </div>
  );
};
