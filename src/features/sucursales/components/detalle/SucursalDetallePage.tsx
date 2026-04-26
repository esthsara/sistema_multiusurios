import { Button, Skeleton, Tabs, Tag } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useSucursalDetalle } from "../../hooks/useSucursalDetalle";
import { SucursalInfoGeneral } from "./SucursalInfoGeneral";
import { SucursalContacto } from "./SucursalContacto";
import { SucursalDomicilio } from "./SucursalDomicilio";
import { SucursalArchivo } from "./SucursalArchivo";
import { SucursalUsuarioAsignado } from "./AsignacionUser/SucursalUsuarioAsignado";
import { SucursalAuditoria } from "./SucursalAuditoria";

const SucursalDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <div>ID de sucursal no válido</div>;

  const sucursalId = Number(id);
  const { sucursal, loading } = useSucursalDetalle(sucursalId);

  if (loading) return <Skeleton active />;
  if (!sucursal) return <div>Sucursal no encontrada</div>;

  const tabs = [
    {
      key: "general",
      label: "Información General",
      children: <SucursalInfoGeneral sucursal={sucursal} />,
    },
    {
      key: "contactos",
      label: "Contactos",
      children: <SucursalContacto sucursalId={sucursal.id} />,
    },
    {
      key: "domicilios",
      label: "Domicilios",
      children: <SucursalDomicilio sucursalId={sucursal.id} />,
    },
    {
      key: "archivos",
      label: "Archivos",
      children: <SucursalArchivo sucursalId={sucursal.id} />,
    },
    {
      key: "usuarios",
      label: "Usuarios Asignados",
      children: <SucursalUsuarioAsignado sucursal={sucursal} />,
    },
    {
      key: "auditoria",
      label: "Auditoría",
      children: <SucursalAuditoria sucursalId={sucursal.id} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={sucursal.nombre}
        description={`${sucursal.codigo} · ${sucursal.email}`}
        breadcrumbs={[
          { label: "Gestión de Personas" },
          { label: "Sucursales", path: APP_ROUTES.DASHBOARD.SUCURSALES.ROOT },
          { label: sucursal.nombre },
        ]}
        actions={
          <Button
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate(APP_ROUTES.DASHBOARD.SUCURSALES.ROOT)}
          >
            Volver
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        <Tag color={sucursal.activa ? "green" : "red"}>
          {sucursal.activa ? "Activa" : "Inactiva"}
        </Tag>
        <Tag color="blue">{sucursal.codigo}</Tag>
      </div>

      <Tabs
        items={tabs}
        defaultActiveKey="general"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
          padding: "0 16px 16px",
          border: "1px solid var(--color-border)",
        }}
      />
    </div>
  );
};

export default SucursalDetallePage;
