// src/features/usuarios/components/detalle/UsuarioSucursales.tsx
import { Table, Tag, Avatar, Badge } from "antd";
import { Building2 } from "lucide-react";
import type { TableColumnsType } from "antd";
import type {
  UsuarioDetalle,
  UsuarioSucursalBackend,
} from "../../types/usuario.types";

interface UsuarioSucursalesProps {
  usuario: UsuarioDetalle;
}

export const UsuarioSucursales = ({ usuario }: UsuarioSucursalesProps) => {
  const columns: TableColumnsType<UsuarioSucursalBackend> = [
    {
      title: "Sucursal",
      key: "nombre",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={32}
            src={r.logo ?? undefined}
            icon={<Building2 size={16} />}
            style={{ backgroundColor: "var(--color-primary-100)" }}
          />
          <div>
            <p
              className="font-medium m-0 text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              {r.nombre}
            </p>
            <p
              className="text-xs m-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {r.codigo}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email: string) => (
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {email}
        </span>
      ),
    },
    {
      title: "Horario",
      key: "horario",
      width: 150,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.horario}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "activa",
      width: 100,
      render: (_, r) => (
        <Badge
          status={r.activa ? "success" : "error"}
          text={r.activa ? "Activa" : "Inactiva"}
        />
      ),
    },
    {
      title: "Registro",
      key: "created_at",
      width: 130,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.created_at_humano}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Sucursales Asignadas
        </h3>
        <Tag>{usuario.sucursales.length} sucursales</Tag>
      </div>

      {usuario.sucursales.length === 0 ? (
        <div
          className="text-center py-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Building2 size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Este usuario no tiene sucursales asignadas</p>
        </div>
      ) : (
        <Table
          dataSource={usuario.sucursales}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderRadius: "var(--radius-card)",
          }}
        />
      )}
    </div>
  );
};
