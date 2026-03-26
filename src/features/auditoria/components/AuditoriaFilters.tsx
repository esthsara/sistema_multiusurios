import { Button, DatePicker, Input, Row, Col, Select, Segmented } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Calendar, Download, Search } from "lucide-react";
import type {
  AuditoriaFilters as AuditoriaFilterValues,
  AuditoriaViewMode,
} from "../types/auditoria.types";

interface UsuarioOption {
  value: number;
  label: string;
}

interface EntidadOption {
  value: string;
  label: string;
}

interface AuditoriaFiltersProps {
  search: string;
  filters: AuditoriaFilterValues;
  acciones: string[];
  entidades: EntidadOption[];
  usuarios: UsuarioOption[];
  viewMode: AuditoriaViewMode;
  loading: boolean;
  exporting: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: Partial<AuditoriaFilterValues>) => void;
  onViewModeChange: (mode: AuditoriaViewMode) => void;
  onReset: () => void;
  onExport: () => void;
}

const toDateValue = (value?: string) => {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
};

const toApiDate = (date: Dayjs | null) => {
  if (!date) return "";
  return date.format("YYYY-MM-DD");
};

export const AuditoriaFiltersPanel = ({
  search,
  filters,
  acciones,
  entidades,
  usuarios,
  viewMode,
  loading,
  exporting,
  onSearchChange,
  onFiltersChange,
  onViewModeChange,
  onReset,
  onExport,
}: AuditoriaFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={10}>
          <Input
            placeholder="Buscar por nombre o código"
            value={search}
            prefix={<Search size={16} />}
            allowClear
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>

        <Col xs={12} md={4}>
          <DatePicker
            className="w-full"
            placeholder="Desde"
            value={toDateValue(filters.fecha_inicio)}
            onChange={(date) =>
              onFiltersChange({ fecha_inicio: toApiDate(date) })
            }
            format="DD/MM/YYYY"
            suffixIcon={<Calendar size={16} />}
            allowClear
          />
        </Col>

        <Col xs={12} md={4}>
          <DatePicker
            className="w-full"
            placeholder="Hasta"
            value={toDateValue(filters.fecha_fin)}
            onChange={(date) => onFiltersChange({ fecha_fin: toApiDate(date) })}
            format="DD/MM/YYYY"
            suffixIcon={<Calendar size={16} />}
            allowClear
          />
        </Col>

        <Col xs={24} md={6} className="flex justify-end gap-2">
          <Button onClick={onReset} disabled={loading || exporting}>
            Limpiar
          </Button>
          <Button
            type="primary"
            icon={<Download size={16} />}
            loading={exporting}
            onClick={onExport}
          >
            Exportar
          </Button>
        </Col>
      </Row>

      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={5}>
          <Segmented
            block
            options={[
              { label: "Línea Tiempo", value: "timeline" },
              { label: "Tabla", value: "table" },
            ]}
            value={viewMode}
            onChange={(value) => onViewModeChange(value as AuditoriaViewMode)}
          />
        </Col>

        <Col xs={24} md={6}>
          <Select
            className="w-full"
            placeholder="Todas las Acciones"
            value={filters.accion || undefined}
            options={acciones.map((accion) => ({
              label: accion,
              value: accion,
            }))}
            onChange={(value) => onFiltersChange({ accion: value || "" })}
            allowClear
          />
        </Col>

        <Col xs={24} md={6}>
          <Select
            className="w-full"
            placeholder="Todas las Entidades"
            value={filters.entidad_type || undefined}
            options={entidades.map((entidad) => ({
              label: entidad.label,
              value: entidad.value,
            }))}
            onChange={(value) => onFiltersChange({ entidad_type: value || "" })}
            allowClear
          />
        </Col>

        <Col xs={24} md={7}>
          <Select
            className="w-full"
            placeholder="Todos los Usuarios"
            value={filters.usuario_id || undefined}
            options={usuarios}
            onChange={(value) => onFiltersChange({ usuario_id: value || "" })}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Col>
      </Row>
    </div>
  );
};
