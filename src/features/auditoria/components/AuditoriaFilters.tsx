import { Button, DatePicker, Input, Row, Col, Select, Segmented, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Calendar, Download, RotateCcw, Search } from "lucide-react";
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
    <div
      className="mb-6 p-4 rounded-xl border"
      style={{
        background: "var(--color-bg-base)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* HEADER / TOOLBAR */}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Vista:
            </span>

            <Segmented
              options={[
                {
                  label: (
                    <span
                      className={`flex items-center gap-1 ${
                        viewMode === "timeline"
                          ? "border-b-2 border-blue-500 text-blue-600 font-semibold pb-1"
                          : "text-gray-600"
                      }`}
                    >
                      <Calendar size={14} />
                      Linea de Tiempo
                    </span>
                  ),
                  value: "timeline",
                },
                {
                  label: (
                    <span
                      className={`flex items-center gap-1 ${
                        viewMode === "table"
                          ? "border-b-2 border-blue-500 text-blue-600 font-semibold pb-1"
                          : "text-gray-600"
                      }`}
                    >
                      <Search size={14} />
                      Tabla
                    </span>
                  ),
                  value: "table",
                },
              ]}
              value={viewMode}
              onChange={(value) => onViewModeChange(value as AuditoriaViewMode)}
            />
          </div>
        </Col>

        {/* BOTONES */}
        <Col>
          <Space>
            <Button
              icon={<RotateCcw size={14} />}
              onClick={onReset}
              disabled={loading || exporting}
            >
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
          </Space>
        </Col>
      </Row>

      {/*  FILA PRINCIPAL (más limpia y alineada) */}
      <Row gutter={[12, 12]} align="middle">
        {/* BUSCADOR */}
        <Col xs={24} md={12}>
          <Input
            placeholder="Buscar por nombre o código"
            value={search}
            prefix={<Search size={16} />}
            allowClear
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>

        {/* FECHAS AGRUPADAS */}
        <Col xs={24} md={12}>
          <div className="flex gap-2">
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

            <DatePicker
              className="w-full"
              placeholder="Hasta"
              value={toDateValue(filters.fecha_fin)}
              onChange={(date) =>
                onFiltersChange({ fecha_fin: toApiDate(date) })
              }
              format="DD/MM/YYYY"
              suffixIcon={<Calendar size={16} />}
              allowClear
            />
          </div>
        </Col>
      </Row>

      {/*  BARRA DE FILTROS (tipo toolbar) */}
      <div
        className="mt-4 p-3 rounded-lg flex flex-wrap items-center gap-2"
        style={{
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* ICONO FILTRO */}
        <div
          className="flex items-center gap-1 px-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Search size={14} />
          <span className="text-sm">Filtros:</span>
        </div>

        {/* ACCIONES */}
        <Select
          className="min-w-[160px]"
          placeholder="Acciones"
          value={filters.accion || undefined}
          options={acciones.map((accion) => ({
            label: accion,
            value: accion,
          }))}
          onChange={(value) => onFiltersChange({ accion: value || "" })}
          allowClear
        />

        {/* ENTIDADES */}
        <Select
          className="min-w-[180px]"
          placeholder="Entidades"
          value={filters.entidad_type || undefined}
          options={entidades.map((entidad) => ({
            label: entidad.label,
            value: entidad.value,
          }))}
          onChange={(value) => onFiltersChange({ entidad_type: value || "" })}
          allowClear
        />

        {/* USUARIOS */}
        <Select
          className="min-w-[200px]"
          placeholder="Usuarios"
          value={filters.usuario_id || undefined}
          options={usuarios}
          onChange={(value) => onFiltersChange({ usuario_id: value || "" })}
          allowClear
          showSearch
          optionFilterProp="label"
        />
      </div>
    </div>
  );
};
