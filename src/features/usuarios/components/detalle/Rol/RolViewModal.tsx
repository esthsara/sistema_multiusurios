import { Checkbox, Empty, Modal, Space, Spin, Typography, theme } from "antd";
import { UserCog } from "lucide-react";
import { Flex } from "antd";
import { AppTag } from "@/shared/components/atoms/AppTag";
import type { RolListItem } from "@/features/roles/types/rol.types";
import type { UsuarioRolDetalle } from "../../../types/usuario.types";



const { Text, Title } = Typography;

interface RolViewModalProps {
  open: boolean;
  username: string;
  roles: RolListItem[];
  rolesActuales: UsuarioRolDetalle[];
  selectedRoleIds: number[];
  loading: boolean;
  submitting: boolean;
  onToggleRol: (roleId: number) => void;
  onGuardar: () => Promise<void>;
  onCancel: () => void;
}

export const RolViewModal = ({
  open,
  username,
  roles,
  rolesActuales,
  selectedRoleIds,
  loading,
  submitting,
  onToggleRol,
  onGuardar,
  onCancel,
}: RolViewModalProps) => {
  const { token } = theme.useToken();

  return (
    <Modal
      open={open}
      title={
        <Flex align="center" gap={10}>
          <UserCog size={20} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Gestionar Roles
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Activa o desactiva los roles para <strong>{username}</strong>
            </Text>
          </div>
        </Flex>
      }
      onCancel={onCancel}
      onOk={onGuardar}
      okText="Guardar cambios"
      cancelText="Cancelar"
      okButtonProps={{ loading: submitting, disabled: submitting }}
      width={520}
      centered
      destroyOnHidden
      styles={{ mask: { backdropFilter: "blur(6px)" } }}
    >
      <Spin spinning={loading}>
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
          <Space orientation="vertical" style={{ width: "100%" }} size={8}>
            {roles.map((rol) => {
              const isSelected = selectedRoleIds.includes(rol.id);
              const wasOriginal = rolesActuales.some((r) => r.id === rol.id);
              const changed = isSelected !== wasOriginal;

              return (
                <div
                  key={rol.id}
                  onClick={() => onToggleRol(rol.id)}
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
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleRol(rol.id)}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ color: "var(--color-text-primary)" }}>
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
  );
};
