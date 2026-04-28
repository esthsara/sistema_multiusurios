import { Input, Select, Button, Card, Flex } from "antd";
import { Search, RotateCcw } from "lucide-react";
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
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-filter)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Flex wrap="wrap" gap="middle" align="center">
        {/* 🔍 BUSCADOR MEJORADO */}
        <Input
          prefix={<Search size={16} />}
          placeholder="Buscar permiso, acción o nombre..."
          value={filters.search || ""}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          allowClear
          style={{ width: 260 }}
        />

        {/* 📂 FILTRO DE MÓDULOS */}
        <Select
          mode="multiple"
          placeholder="Filtrar por módulos"
          value={filters.modulos || []}
          onChange={(value) =>
            setFilters({ ...filters, modulos: value })
          }
          options={modulos.map((m) => ({ label: m, value: m }))}
          style={{ minWidth: 200 }}
          maxTagCount="responsive"
          allowClear
        />

        {/* 🎯 MODO FOCO EN UN ROL */}
        <Select
          placeholder="Seleccionar rol (modo foco)"
          value={filters.selectedRol ?? undefined}
          onChange={(value) =>
            setFilters({ ...filters, selectedRol: value })
          }
          options={roles.map((r) => ({
            label: r.name,
            value: r.id,
          }))}
          style={{ width: 220 }}
          allowClear
        />

        {/* 🧹 LIMPIAR */}
        <Button
          icon={<RotateCcw size={16} />}
          onClick={() =>
            setFilters({
              search: "",
              modulos: [],
              roles: [],
              selectedRol: null,
            })
          }
        >
          Limpiar
        </Button>
      </Flex>
    </Card>
  );
};