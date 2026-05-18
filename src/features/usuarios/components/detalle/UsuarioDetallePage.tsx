// src/features/usuarios/components/detalle/UsuarioDetallePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Skeleton, Tag } from "antd";
import { ArrowLeft, Pencil } from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { Can } from "@/shared/components/guards/Can";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { useUsuarioDetalle } from "../../hooks/useUsuarioDetalle";
import { useUsuarioForm } from "../../hooks/useUsuarioForm";
import { UsuarioDatosGenerales } from "./UsuarioDatosGenerales";
import { UsuarioSucursales } from "./UsuarioSucursales";
import { UsuarioRol } from "./UsuarioRol";
import { UsuarioAuditoria } from "./UsuarioAuditoria";
import { UsuarioFormModal } from "../UsuarioFormModal";
import { getUsuarioDisplayName } from "../../utils/usuario.formatters";

const UsuarioDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>ID de usuario no válido</div>;
  }

  const usuarioId = parseInt(id);
  const {
    usuario,
    loading,
    toggleBloqueo,
    cerrarSesiones,
    cambiarRol,
    refetch,
  } = useUsuarioDetalle(usuarioId);
  const form = useUsuarioForm(refetch);

  if (loading) {
    return <Skeleton active />;
  }

  if (!usuario) {
    return <div>Usuario no encontrado</div>;
  }

  const nombreDisplay = getUsuarioDisplayName(usuario);

  const tabs = [
    {
      key: "info",
      label: "Información General",
      children: (
        <UsuarioDatosGenerales
          usuario={usuario}
          onToggleBloqueo={toggleBloqueo}
          onCerrarSesiones={cerrarSesiones}
          onResetPassword={() => {
            // TODO: Implementar reset password desde aquí
          }}
        />
      ),
    },
    {
      key: "sucursales",
      label: "Sucursales",
      children: <UsuarioSucursales usuario={usuario} />,
    },
    {
      key: "rol",
      label: "Rol",
      children: <UsuarioRol usuario={usuario} onCambiarRol={cambiarRol} />,
    },
    {
      key: "auditoria",
      label: "Auditoría",
      children: <UsuarioAuditoria usuarioId={usuarioId} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={loading ? "Cargando..." : nombreDisplay}
        description={
          usuario ? `@${usuario.username} · ${usuario.email}` : undefined
        }
        breadcrumbs={[
          { label: "Gestión de Personas" },
          { label: "Usuarios", path: APP_ROUTES.DASHBOARD.USUARIOS.ROOT },
          { label: nombreDisplay },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              icon={<ArrowLeft size={15} />}
              onClick={() => navigate(APP_ROUTES.DASHBOARD.USUARIOS.ROOT)}
            >
              Volver
            </Button>
            <Can permission="usuarios.editar">
              <Button
                type="primary"
                icon={<Pencil size={15} />}
                onClick={() => form.handleEdit(usuario)}
              >
                Editar
              </Button>
            </Can>
          </div>
        }
      />

      {usuario && (
        <div className="mb-4 flex gap-2">
          <Tag color={usuario.activo ? "green" : "red"}>
            {usuario.activo ? "Activo" : "Inactivo"}
          </Tag>
          <Tag
            color={
              usuario.persona.tipo_persona === "FISICA" ? "blue" : "purple"
            }
          >
            {usuario.persona.tipo_texto}
          </Tag>
        </div>
      )}

      <Tabs
        items={tabs}
        defaultActiveKey="info"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
          padding: "0 16px 16px",
          border: "1px solid var(--color-border)",
        }}
      />

      <UsuarioFormModal
        open={form.modal.isOpen}
        selectedItem={form.modal.selectedItem}
        isEditMode={form.modal.isEditMode}
        isSubmitting={form.isSubmitting}
        onSubmit={form.handleSubmit}
        onCancel={form.modal.close}
      />
    </div>
  );
};

export default UsuarioDetallePage;
