import {
  Button,
  DatePicker,
  Input,
  Row,
  Col,
  Select,
  Segmented,
  Space,
} from "antd";
import { Search, Calendar, Trash2, Monitor, Smartphone } from "lucide-react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { SessionsFilters } from "../types/sessions.types";

interface SessionFiltersProps {
  search: string;
  filters: SessionsFilters;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: Partial<SessionsFilters>) => void;
  onReset: () => void;
  onRevokeAll: () => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

const toDateValue = (value?: string) => {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
};

export const SessionFilters = ({
  search,
  filters,
  loading,
  onSearchChange,
  onFiltersChange,
  onReset,
  onRevokeAll,
  viewMode,
  onViewModeChange,
}: SessionFiltersProps) => {
  return (
    <div
      className="mb-6 p-4 rounded-xl border"
      style={{
        background: "var(--color-bg-base)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
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
                { label: "Tarjetas", value: "cards" },
                { label: "Tabla", value: "table" },
              ]}
              value={viewMode}
              onChange={(v) => onViewModeChange(v as "cards" | "table")}
            />
          </div>
        </Col>

        <Col>
          <Space>
            <Button
              icon={<Trash2 size={14} />}
              onClick={onReset}
              disabled={loading}
            >
              Limpiar
            </Button>

            <Button
              type="primary"
              danger
              icon={<Monitor size={14} />}
              onClick={onRevokeAll}
            >
              Cerrar sesiones
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={10}>
          <Input
            placeholder="Buscar por usuario, dispositivo o IP"
            value={search}
            prefix={<Search size={16} />}
            allowClear
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>

        <Col xs={24} md={7}>
          <Select
            placeholder="Dispositivo"
            className="w-full"
            value={filters.dispositivo || undefined}
            options={[
              { label: "Windows", value: "Windows" },
              { label: "Linux", value: "Linux" },
              { label: "Mac", value: "Mac" },
              { label: "Postman", value: "Postman" },
              { label: "Mobile", value: "Mobile" },
              { label: "Unknown", value: "Unknown" },
            ]}
            onChange={(v) => onFiltersChange({ dispositivo: v || "" })}
            allowClear
          />
        </Col>

        <Col xs={24} md={7}>
          <Select
            placeholder="Estado"
            className="w-full"
            value={filters.activa || undefined}
            options={[
              { label: "Todas", value: "" },
              { label: "Activa", value: "true" },
              { label: "Inactiva", value: "false" },
            ]}
            onChange={(v) => onFiltersChange({ activa: v || "" })}
            allowClear
          />
        </Col>

        <Col xs={24} md={12}>
          <div className="flex gap-2">
            <DatePicker
              className="w-full"
              placeholder="Desde"
              value={toDateValue(filters.fecha_desde)}
              onChange={(date: Dayjs | null) =>
                onFiltersChange({
                  fecha_desde: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              format="DD/MM/YYYY"
              suffixIcon={<Calendar size={16} />}
              allowClear
            />

            <DatePicker
              className="w-full"
              placeholder="Hasta"
              value={toDateValue(filters.fecha_hasta)}
              onChange={(date: Dayjs | null) =>
                onFiltersChange({
                  fecha_hasta: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              format="DD/MM/YYYY"
              suffixIcon={<Calendar size={16} />}
              allowClear
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SessionFilters;
