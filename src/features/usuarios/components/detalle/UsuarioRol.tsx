// src/features/usuarios/components/detalle/UsuarioRol.tsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Flex,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import {
  CheckCircle2,
  ShieldCheck,
  ShieldOff,
  UserCog,
  XCircle,
} from "lucide-react";
import { Can } from "@/shared/components/guards/Can";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { useRolesUsuario } from "@/features/roles/hooks/useRolesUsuario";
import type {
  UsuarioDetalle,
  RolDetalle as UsuarioRolDetalle,
} from "../../types/usuario.types";
import { getModuloStyles } from "@/features/roles/utils/roles.utils";

/** Alias local compatible con roles_detalle del usuario */
type RolDetalleSimple = UsuarioRolDetalle;

const { Text, Title } = Typography;

interface UsuarioRolProps {
  usuario: UsuarioDetalle;
  /** Llamado después de una asignación/desasignación exitosa para refrescar el detalle */
  onRolesChanged?: (rolesDetalle: RolDetalleSimple[]) => void;
}

/** Permisos que se clasifican como "alto impacto" */
const ACCIONES_CRITICAS = ["eliminar", "eliminar_permanente", "exportar"];

const formatPermiso = (permiso: string) => {
  const [modulo = "general", accion = "acceso"] = permiso.split(".");
  return {
    modulo: modulo.replaceAll("_", " "),
    accion: accion.replaceAll("_", " "),
  };
};

const accionTone = (
  accion: string,
): "success" | "warning" | "danger" | "primary" | "neutral" => {
  if (accion.includes("eliminar")) return "danger";
  if (accion.includes("exportar")) return "warning";
  if (accion.includes("crear") || accion.includes("subir")) return "primary";
  if (accion.includes("editar")) return "warning";
  return "success";
};

export const UsuarioRol = ({ usuario, onRolesChanged }: UsuarioRolProps) => {
  const { token } = theme.useToken();
  const [modalOpen, setModalOpen] = useState(false);

  // Roles actuales del usuario (como objetos con id+name)
  const [rolesActuales, setRolesActuales] = useState<RolDetalleSimple[]>(
    usuario.roles_detalle ?? [],
  );

  // IDs de roles seleccionados en el modal (para asignar/quitar)
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const {
    roles,
    loadingRoles,
    submitting,
    fetchRoles,
    asignarRoles,
    quitarRoles,
  } = useRolesUsuario(usuario.id);

  /* ── Sync con prop externa ── */
  useEffect(() => {
    setRolesActuales(usuario.roles_detalle ?? []);
  }, [usuario.roles_detalle]);

  /* ── Abrir modal → cargar catálogo de roles ── */
  const handleOpenModal = async () => {
    setSelectedRoleIds(rolesActuales.map((r) => r.id));
    await fetchRoles();
    setModalOpen(true);
  };

  /* ── Guardar cambios en el modal ── */
  const handleGuardar = async () => {
    const actualesIds = rolesActuales.map((r) => r.id);
    const idsAAsignar = selectedRoleIds.filter(
      (id) => !actualesIds.includes(id),
    );
    const idsAQuitar = actualesIds.filter(
      (id) => !selectedRoleIds.includes(id),
    );

    let rolesResultado: RolDetalleSimple[] | null = null;

    if (idsAAsignar.length > 0) {
      rolesResultado = await asignarRoles(idsAAsignar);
    }
    if (idsAQuitar.length > 0) {
      rolesResultado = await quitarRoles(idsAQuitar);
    }

    if (rolesResultado !== null) {
      setRolesActuales(rolesResultado);
      onRolesChanged?.(rolesResultado);
    }

    setModalOpen(false);
  };

  /* ── Toggle de un rol en el modal ── */
  const toggleRol = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  /* ── Clasificación de permisos ── */
  const permisosNormales = usuario.permisos.filter(
    (p) => !ACCIONES_CRITICAS.some((a) => p.endsWith(`.${a}`)),
  );
  const permisosRestringidos = usuario.permisos.filter((p) =>
    ACCIONES_CRITICAS.some((a) => p.endsWith(`.${a}`)),
  );

  const rolesNombres = rolesActuales.map((r) => r.name);

  return (
    <div>
      {/* ── Header ── */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Flex align="center" gap={8}>
          <ShieldCheck size={18} style={{ color: token.colorPrimary }} />
          <Title level={5} style={{ margin: 0 }}>
            Roles y permisos
          </Title>
        </Flex>
        <Can permission="roles.editar">
          <Button
            type="primary"
            size="middle"
            icon={<UserCog size={15} />}
            onClick={handleOpenModal}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            Gestionar roles
          </Button>
        </Can>
      </Flex>

      <Card
        style={{
          background: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* ── Roles actuales ── */}
        <div style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Roles asignados
          </Text>
          <Flex wrap="wrap" gap={8}>
            {rolesNombres.length === 0 ? (
              <AppTag tone="neutral" icon={<ShieldOff size={12} />}>
                Sin roles asignados
              </AppTag>
            ) : (
              rolesNombres.map((rol) => (
                <AppTag
                  key={rol}
                  tone="primary"
                  icon={<ShieldCheck size={12} />}
                >
                  {rol}
                </AppTag>
              ))
            )}
          </Flex>
        </div>

        {/* ── Permisos concedidos vs alto impacto ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* Concedidos */}
          <div
            style={{
              borderRadius: "var(--radius-md)",
              padding: 12,
              background: "var(--color-alert-success-bg)",
              border:
                "1px solid color-mix(in srgb, var(--color-success-500) 20%, transparent)",
            }}
          >
            <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
              <CheckCircle2
                size={14}
                style={{ color: "var(--color-success-500)", flexShrink: 0 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                Permisos Concedidos
              </Text>
              <Tag
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: 10,
                  background: "var(--color-alert-success-bg)",
                  color: "var(--color-success-500)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-success-500) 30%, transparent)",
                }}
              >
                {permisosNormales.length}
              </Tag>
            </Flex>
            <Flex wrap="wrap" gap={4}>
              {permisosNormales.length === 0 ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Sin permisos concedidos
                </Text>
              ) : (
                permisosNormales.map((permiso) => {
                  const { modulo, accion } = formatPermiso(permiso);
                  const moduloStyles = getModuloStyles(modulo);
                  return (
                    <Tooltip key={permiso} title={permiso}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-bg-base)",
                          border: `1px solid ${moduloStyles.borderColor}`,
                          color: "var(--color-text-primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          cursor: "default",
                        }}
                      >
                        <strong
                          style={{
                            color: moduloStyles.color,
                            textTransform: "uppercase",
                            fontSize: 10,
                          }}
                        >
                          {modulo}
                        </strong>
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          ·
                        </span>
                        <span className="capitalize">{accion}</span>
                      </span>
                    </Tooltip>
                  );
                })
              )}
            </Flex>
          </div>

          {/* Alto Impacto */}
          <div
            style={{
              borderRadius: "var(--radius-md)",
              padding: 12,
              background: "var(--color-alert-danger-bg)",
              border:
                "1px solid color-mix(in srgb, var(--color-danger-500) 20%, transparent)",
            }}
          >
            <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
              <XCircle
                size={14}
                style={{ color: "var(--color-danger-500)", flexShrink: 0 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                Alto Impacto
              </Text>
              <Tag
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: 10,
                  background: "var(--color-alert-danger-bg)",
                  color: "var(--color-danger-500)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-danger-500) 30%, transparent)",
                }}
              >
                {permisosRestringidos.length}
              </Tag>
            </Flex>
            <Flex wrap="wrap" gap={4}>
              {permisosRestringidos.length === 0 ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Sin permisos de alto impacto
                </Text>
              ) : (
                permisosRestringidos.map((permiso) => {
                  const { modulo, accion } = formatPermiso(permiso);
                  return (
                    <Tooltip key={permiso} title={permiso}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-bg-base)",
                          border:
                            "1px solid color-mix(in srgb, var(--color-danger-500) 28%, transparent)",
                          color: "var(--color-text-primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          cursor: "default",
                        }}
                      >
                        <strong
                          style={{
                            color: "var(--color-danger-500)",
                            textTransform: "uppercase",
                            fontSize: 10,
                          }}
                        >
                          {modulo}
                        </strong>
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          ·
                        </span>
                        <span className="capitalize">{accion}</span>
                      </span>
                    </Tooltip>
                  );
                })
              )}
            </Flex>
          </div>
        </div>
      </Card>

      {/* ── Modal de gestión de roles ── */}
      <Modal
        open={modalOpen}
        title={
          <Flex align="center" gap={10}>
            <UserCog size={20} style={{ color: token.colorPrimary }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Gestionar Roles
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Activa o desactiva los roles para{" "}
                <strong>{usuario.username}</strong>
              </Text>
            </div>
          </Flex>
        }
        onCancel={() => setModalOpen(false)}
        onOk={handleGuardar}
        okText="Guardar cambios"
        cancelText="Cancelar"
        okButtonProps={{ loading: submitting, disabled: submitting }}
        width={520}
        centered
        destroyOnClose
        styles={{ mask: { backdropFilter: "blur(6px)" } }}
      >
        <Spin spinning={loadingRoles}>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: 12, fontSize: 12 }}
          >
            Haz clic en un rol para asignarlo o quitarlo. Los cambios se aplican
            al guardar.
          </Text>

          {roles.length === 0 ? (
            <Empty
              description="No hay roles disponibles"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {roles.map((rol) => {
                const isSelected = selectedRoleIds.includes(rol.id);
                const wasOriginal = rolesActuales.some((r) => r.id === rol.id);
                const changed = isSelected !== wasOriginal;

                return (
                  <div
                    key={rol.id}
                    onClick={() => toggleRol(rol.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected
                        ? `2px solid ${token.colorPrimary}`
                        : "1px solid var(--color-border)",
                      background: isSelected
                        ? `color-mix(in srgb, ${token.colorPrimary} 6%, var(--color-bg-base))`
                        : "var(--color-bg-base)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      position: "relative",
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleRol(rol.id)}
                    />
                    <div style={{ flex: 1 }}>
                      <Text
                        strong
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {rol.name}
                      </Text>
                    </div>
                    {changed && (
                      <AppTag
                        tone={isSelected ? "success" : "danger"}
                        style={{ fontSize: 10 }}
                      >
                        {isSelected ? "+Asignar" : "−Quitar"}
                      </AppTag>
                    )}
                  </div>
                );
              })}
            </Space>
          )}
        </Spin>
      </Modal>
    </div>
  );
};
