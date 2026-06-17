import { Button, Skeleton, Tabs } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSucursalDetalle } from "@/features/sucursales/hooks/useSucursalDetalle";
import { SucursalInfoGeneral } from "./SucursalInfoGeneral";
import { SucursalContacto } from "./SucursalContacto";
import { SucursalDomicilio } from "./SucursalDomicilio";
import { SucursalArchivo } from "./SucursalArchivo";
import { SucursalUsuarioAsignado } from "./SucursalUsuarioAsignado";
import { SucursalAuditoria } from "./SucursalAuditoria";
import { AppTag } from "@/shared/components/atoms/AppTag";

const SucursalDetallePage = () => {
  const { id, tab } = useParams<{ id: string; tab?: string }>();
  const navigate = useNavigate();
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  if (!id) return <div>ID de sucursal no válido</div>;

  const sucursalId = Number(id);
  const { sucursal, loading } = useSucursalDetalle(sucursalId);

  if (loading) return <Skeleton active />;
  if (!sucursal) return <div>Sucursal no encontrada</div>;

  const activeTab = tab || "general";
  const allTabs = [];

  allTabs.push({
    key: "general",
    label: "Información General",
    children: <SucursalInfoGeneral sucursal={sucursal} />,
  });

  if (hasAnyPermission(["contactos.ver"])) {
    allTabs.push({
      key: "contactos",
      label: "Contactos",
      children: <SucursalContacto sucursalId={sucursal.id} />,
    });
  }

  if (hasAnyPermission(["domicilios.ver"])) {
    allTabs.push({
      key: "domicilios",
      label: "Domicilios",
      children: <SucursalDomicilio sucursalId={sucursal.id} />,
    });
  }

  if (hasAnyPermission(["archivos.ver"])) {
    allTabs.push({
      key: "archivos",
      label: "Archivos",
      children: <SucursalArchivo sucursalId={sucursal.id} />,
    });
  }

  if (hasAnyPermission(["asignaciones.ver"])) {
    allTabs.push({
      key: "usuarios",
      label: "Usuarios Asignados",
      children: <SucursalUsuarioAsignado sucursal={sucursal} />,
    });
  }

  if (hasAnyPermission(["auditoria.ver"])) {
    allTabs.push({
      key: "auditoria",
      label: "Auditoría",
      children: <SucursalAuditoria sucursalId={sucursal.id} />,
    });
  }

  const isValidTab = allTabs.some((t) => t.key === activeTab);
  if (!isValidTab && tab) {
    return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
  }

  const handleTabChange = (key: string) => {
    navigate(
      APP_ROUTES.DASHBOARD.SUCURSALES.DETALLE(
        id!,
        key === "general" ? "" : key,
      ),
    );
  };

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
        <AppTag tone={sucursal.activa ? "success" : "danger"}>
          {sucursal.activa ? "Activa" : "Inactiva"}
        </AppTag>
        <AppTag tone="blue">{sucursal.codigo}</AppTag>
      </div>

      <Tabs
        items={allTabs}
        activeKey={isValidTab ? activeTab : "general"}
        onChange={handleTabChange}
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
