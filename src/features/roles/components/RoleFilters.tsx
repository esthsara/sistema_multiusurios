import { Button, Input } from "antd";
import { RotateCcw, Search } from "lucide-react";

interface RoleFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}

export const RoleFilters = ({
  search,
  onSearch,
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
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        prefix={
          <Search size={15} style={{ color: "var(--color-primary-400)" }} />
        }
        style={{ width: 280 }}
      />

      <div style={{ flex: 1 }} />

      <Button icon={<RotateCcw size={14} />} onClick={onReset}>
        Limpiar
      </Button>
    </div>
  );
};
