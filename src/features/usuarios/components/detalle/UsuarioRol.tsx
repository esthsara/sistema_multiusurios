// src/features/usuarios/components/detalle/UsuarioRol.tsx
import { useEffect, useState } from "react";
import { Button, Card, Flex, Typography, theme } from "antd";
import { ShieldCheck, UserCog } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRolesUsuario } from "@/features/roles/hooks/useRolesUsuario";
import type { UsuarioConRoles } from "@/features/roles/types/rol.types";

import type {
  RolDetalle as UsuarioRolDetalle,
  UsuarioDetalle,
} from "../../types/usuario.types";

import { PermisosView } from "./Rol/PermisosView";
import { RolTable } from "./Rol/RolTable";
import { RolViewModal } from "./Rol/RolViewModal";

type RolDetalleSimple = UsuarioRolDetalle;

const { Title } = Typography;

interface UsuarioRolProps {
  usuario: UsuarioDetalle;
  onRolesChanged?: (rolesDetalle: RolDetalleSimple[]) => void;
}

export const UsuarioRol = ({ usuario, onRolesChanged }: UsuarioRolProps) => {
  const { token } = theme.useToken();
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canGestionarRoles =
    hasPermission("roles.ver") && hasPermission("usuarios.editar") && usuario.activo;

  const [modalOpen, setModalOpen] = useState(false);
  const [rolesActuales, setRolesActuales] = useState<RolDetalleSimple[]>(
    usuario.roles_detalle ?? [],
  );
  const [permisosActuales, setPermisosActuales] = useState<string[]>(
    usuario.permisos ?? [],
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const {
    roles,
    loadingRoles,
    submitting,
    fetchRoles,
    asignarRoles,
    quitarRoles,
  } = useRolesUsuario(usuario.id);

  useEffect(() => {
    setRolesActuales(usuario.roles_detalle ?? []);
    setPermisosActuales(usuario.permisos ?? []);
  }, [usuario.roles_detalle, usuario.permisos]);

  const handleOpenModal = async () => {
    if (!canGestionarRoles) return;
    setSelectedRoleIds(rolesActuales.map((rol) => rol.id));
    await fetchRoles();
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    if (!canGestionarRoles) return;

    const actualesIds = rolesActuales.map((rol) => rol.id);
    const idsAAsignar = selectedRoleIds.filter(
      (id) => !actualesIds.includes(id),
    );
    const idsAQuitar = actualesIds.filter(
      (id) => !selectedRoleIds.includes(id),
    );

    let resultado: UsuarioConRoles | null = null;

    if (idsAAsignar.length > 0) {
      resultado = await asignarRoles(idsAAsignar);
    }

    if (idsAQuitar.length > 0) {
      resultado = await quitarRoles(idsAQuitar);
    }

    if (resultado) {
      setRolesActuales(resultado.roles_detalle ?? []);
      setPermisosActuales(resultado.permisos ?? []);
      onRolesChanged?.(resultado.roles_detalle ?? []);
    }

    setModalOpen(false);
  };

  const toggleRol = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Flex align="center" gap={8}>
          <ShieldCheck size={18} style={{ color: token.colorPrimary }} />
          <Title level={5} style={{ margin: 0 }}>
            Roles y permisos
          </Title>
        </Flex>

        {canGestionarRoles && (
          <Button
            type="primary"
            size="middle"
            icon={<UserCog size={15} />}
            onClick={handleOpenModal}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            Gestionar roles
          </Button>
        )}
      </Flex>

      <Card
        style={{
          background: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <RolTable roles={rolesActuales} />
        <PermisosView permisos={permisosActuales} />
      </Card>

      <RolViewModal
        open={modalOpen}
        username={usuario.username}
        roles={roles}
        rolesActuales={rolesActuales}
        selectedRoleIds={selectedRoleIds}
        loading={loadingRoles}
        submitting={submitting}
        onToggleRol={toggleRol}
        onGuardar={handleGuardar}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
