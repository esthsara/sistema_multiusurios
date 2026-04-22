import { Descriptions, Empty, Modal, Tag } from "antd";
import type { RolDetalle } from "../types/rol.types";

interface RoleDetailModalProps {
  open: boolean;
  role: RolDetalle | null;
  onClose: () => void;
}

export const RoleDetailModal = ({
  open,
  role,
  onClose,
}: RoleDetailModalProps) => {
  return (
    <Modal
      open={open}
      title="Detalle del rol"
      footer={null}
      onCancel={onClose}
      width={760}
      centered
      destroyOnHidden
    >
      {!role ? (
        <Empty description="No hay información del rol" />
      ) : (
        <div className="pt-2">
          <Descriptions bordered column={2} size="middle" className="mb-4">
            <Descriptions.Item label="Nombre">{role.name}</Descriptions.Item>
            <Descriptions.Item label="Guard">
              {role.guard_name}
            </Descriptions.Item>
            <Descriptions.Item label="Usuarios asignados">
              {role.users_count ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Creado">
              {role.created_at ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Actualizado">
              {role.updated_at ?? "—"}
            </Descriptions.Item>
          </Descriptions>

          <p
            className="font-semibold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Permisos del rol ({role.permissions.length})
          </p>

          <div
            style={{
              maxHeight: 260,
              overflowY: "auto",
              padding: 12,
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-elevated)",
            }}
          >
            {role.permissions.length === 0 ? (
              <Empty
                description="Sin permisos asignados"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Tag key={permission.id} color="blue">
                    {permission.name}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
