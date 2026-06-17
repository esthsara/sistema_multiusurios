import { Input, Select, Button, DatePicker } from "antd";
import { Search, RotateCcw } from "lucide-react";
import dayjs from "dayjs";
import type { UsuarioFilters } from "../types/usuario.types";
import { useAuthStore } from "@/features/auth/store/auth.store";


interface UsuarioFiltersProps {
  filters: UsuarioFilters;
  search: string;
  roleOptions: Array<{ label: string; value: string }>;
  branchOptions: Array<{ label: string; value: number }>;
  onSearch: (value: string) => void;
  onFilter: (filters: Partial<UsuarioFilters>) => void;
  onReset: () => void;
}

export const UsuarioFiltersBar = ({
  filters,
  search,
  roleOptions,
  branchOptions,
  onSearch,
  onFilter,
  onReset,
}: UsuarioFiltersProps) => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canVerRoles = hasPermission("roles.ver");

  const selectedDate =
    filters.fecha_desde &&
    filters.fecha_hasta &&
    filters.fecha_desde === filters.fecha_hasta
      ? dayjs(filters.fecha_desde)
      : null;

  return (
    <div
      className="usuario-filters flex flex-wrap items-center gap-3 mb-4 p-4"
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
        placeholder="Buscar usuario..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        style={{
          width: 260,
        }}
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

      {/* Rol — solo visible si tiene roles.ver */}
      {canVerRoles && (
        <Select
          placeholder="Rol"
          value={filters.rol || undefined}
          onChange={(val) => onFilter({ rol: val ?? "" })}
          allowClear
          style={{
            width: 180,
            background: "var(--color-bg-filter)",
          }}
          options={roleOptions}
        />
      )}

      {/* Sucursal (por ahora visual/API) */}
      <Select
        placeholder="Sucursal"
        value={filters.sucursal_id === "" ? undefined : filters.sucursal_id}
        onChange={(val) => onFilter({ sucursal_id: val ?? "" })}
        allowClear
        style={{
          width: 190,
          background: "var(--color-bg-filter)",
        }}
        options={branchOptions}
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
