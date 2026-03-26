import { Input, Select, Button } from "antd";
import { Search, RotateCcw } from "lucide-react";

interface PermisoFiltersProps {
  search: string;
  modulos: string[];
  selectedModulo: string | undefined;
  onSearch: (value: string) => void;
  onModuloChange: (modulo: string | undefined) => void;
  onReset: () => void;
}

export const PermisoFilters = ({
  search,
  modulos,
  selectedModulo,
  onSearch,
  onModuloChange,
  onReset,
}: PermisoFiltersProps) => {
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
        placeholder="Buscar por nombre, módulo o acción"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        prefix={
          <Search size={15} style={{ color: "var(--color-primary-400)" }} />
        }
        style={{ width: 280 }}
      />

      <Select
        placeholder="Filtrar por módulo"
        value={selectedModulo || undefined}
        onChange={onModuloChange}
        allowClear
        style={{ width: 200 }}
        options={modulos.map((m) => ({ label: m, value: m }))}
      />

      <div style={{ flex: 1 }} />

      <Button icon={<RotateCcw size={14} />} onClick={onReset}>
        Limpiar
      </Button>
    </div>
  );
};
