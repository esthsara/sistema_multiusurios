// src/features/usuarios/components/detalle/UsuarioSucursales.tsx
import { Table, Tag, Avatar, Badge, Button } from "antd";
import { Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TableColumnsType } from "antd";
import type {
  UsuarioDetalle,
  UsuarioSucursalBackend,
} from "../../types/usuario.types";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

interface UsuarioSucursalesProps {
  usuario: UsuarioDetalle;
}

export const UsuarioSucursales = ({ usuario }: UsuarioSucursalesProps) => {
  const navigate = useNavigate();

  const columns: TableColumnsType<UsuarioSucursalBackend> = [
    {
      title: "Sucursal",
      key: "nombre",
      width: 280,
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={32}
            src={r.logo ?? undefined}
            icon={<Building2 size={16} />}
            style={{
              backgroundColor: "var(--color-primary-100)",
              color: "var(--color-primary-600)",
            }}
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
      width: 160,
      render: (_, r) => {
        const horario =
          r.horario_completo ??
          [r.horario_apertura, r.horario_cierre].filter(Boolean).join(" - ") ??
          r.horario;

        return (
          <Tag color="blue" className="rounded-full px-3 py-0.5">
            {horario || "—"}
          </Tag>
        );
      },
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
      title: "Acciones",
      key: "acciones",
      width: 150,
      render: (_, r) => (
        <Button
          type="text"
          size="small"
          icon={<ExternalLink size={14} />}
          className="rounded-lg"
          style={{
            color: "var(--color-primary-600)",
            backgroundColor: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
            fontWeight: 500,
          }}
          onClick={() =>
            navigate(APP_ROUTES.DASHBOARD.SUCURSALES.DETALLE(r.id))
          }
        >
          Ver sucursal
        </Button>
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
        <Tag color="blue" className="rounded-full px-3 py-0.5">
          {usuario.sucursales.length} sucursales
        </Tag>
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
        <div
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(2, 6, 23, 0.04)",
          }}
        >
          <Table
            dataSource={usuario.sucursales}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
      )}
    </div>
  );
};
