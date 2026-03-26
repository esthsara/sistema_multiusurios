import { Input, Select, Button, Row, Col } from "antd";
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
    <Row gutter={[16, 16]} align="middle" className="mb-6 p-4 bg-white rounded">
      <Col flex="auto">
        <Input
          prefix={<Search size={16} />}
          placeholder="Buscar por nombre o código"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          allowClear
          style={{ width: "280px" }}
        />
      </Col>

      <Col>
        <Select
          mode="multiple"
          placeholder="Filtrar por módulos"
          value={filters.modulos || []}
          onChange={(value) => setFilters({ ...filters, modulos: value })}
          options={modulos.map((m) => ({ label: m, value: m }))}
          style={{ minWidth: "200px" }}
          maxTagCount="responsive"
          allowClear
        />
      </Col>

      <Col>
        <Select
          mode="multiple"
          placeholder="Filtrar por roles"
          value={filters.roles || []}
          onChange={(value) => setFilters({ ...filters, roles: value })}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
          style={{ minWidth: "200px" }}
          maxTagCount="responsive"
          allowClear
        />
      </Col>

      <Col>
        <Button
          type="text"
          icon={<RotateCcw size={16} />}
          onClick={() => setFilters({ search: "", modulos: [], roles: [] })}
        >
          Limpiar
        </Button>
      </Col>
    </Row>
  );
};
