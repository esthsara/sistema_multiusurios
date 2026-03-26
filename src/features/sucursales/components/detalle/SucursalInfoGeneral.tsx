import { Card, Descriptions, Tag } from "antd";
import type { SucursalDetalle } from "../../types/sucursal.types";

interface SucursalInfoGeneralProps {
  sucursal: SucursalDetalle;
}

export const SucursalInfoGeneral = ({ sucursal }: SucursalInfoGeneralProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card
        title="Resumen"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span style={{ color: "var(--color-text-secondary)" }}>Código</span>
            <Tag color="blue">{sucursal.codigo}</Tag>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--color-text-secondary)" }}>Estado</span>
            <Tag color={sucursal.activa ? "green" : "red"}>
              {sucursal.activa ? "Activa" : "Inactiva"}
            </Tag>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--color-text-secondary)" }}>
              Usuarios
            </span>
            <strong style={{ color: "var(--color-text-primary)" }}>
              {sucursal.usuarios_count}
            </strong>
          </div>
        </div>
      </Card>

      <Card
        className="lg:col-span-2"
        title="Información de la Sucursal"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Nombre">
            {sucursal.nombre}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{sucursal.email}</Descriptions.Item>
          <Descriptions.Item label="Dirección">
            {sucursal.direccion}
          </Descriptions.Item>
          <Descriptions.Item label="Horario">
            {sucursal.horario_completo}
          </Descriptions.Item>
          <Descriptions.Item label="Descripción" span={2}>
            {sucursal.descripcion || "Sin descripción"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
