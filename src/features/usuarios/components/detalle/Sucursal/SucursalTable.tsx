import { Avatar, Button } from "antd";
import type { TableColumnsType } from "antd";
import { Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppTag } from "@/shared/components/atoms/AppTag";
import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

import type { UsuarioSucursalBackend } from "../../../types/usuario.types";

interface SucursalTableProps {
  data: UsuarioSucursalBackend[];
}

const getHorarioSucursal = (sucursal: UsuarioSucursalBackend) => {
  const horarioBase = [sucursal.horario_apertura, sucursal.horario_cierre]
    .filter(Boolean)
    .join(" - ");

  return sucursal.horario_completo || horarioBase || sucursal.horario || "—";
};

export const SucursalTable = ({ data }: SucursalTableProps) => {
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
      render: (_, r) => (
        <AppTag tone="geekblue">{getHorarioSucursal(r)}</AppTag>
      ),
    },
    {
      title: "Estado",
      key: "activa",
      width: 110,
      render: (_, r) => (
        <AppTag tone={r.activa ? "success" : "danger"}>
          {r.activa ? "Activa" : "Inactiva"}
        </AppTag>
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
    <DataTableSimple
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
};
