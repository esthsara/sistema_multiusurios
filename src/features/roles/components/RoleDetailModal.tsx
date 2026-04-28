import {
  Descriptions,
  Empty,
  Modal,
  Tag,
  Typography,
  Flex,
  Divider,
} from "antd";
import { ShieldCheck, Users, Calendar, Key } from "lucide-react";
import type { RolDetalle } from "../types/rol.types";

const { Title, Text } = Typography;

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
      footer={null}
      onCancel={onClose}
      width={760}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap="middle">
          <ShieldCheck
            size={24}
            style={{ color: "var(--ant-color-primary)" }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Detalle del rol
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Información general y permisos asignados
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
        },
        body: {
          padding: 0,
        },
      }}
    >
      {!role ? (
        <Empty
          description="No hay información del rol"
          style={{ padding: 40 }}
        />
      ) : (
        <div>
          {/* Contenido principal */}
          <div style={{ padding: 24 }}>
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              size="middle"
              labelStyle={{
                fontWeight: 500,
                backgroundColor: "var(--ant-color-bg-layout)",
              }}
              contentStyle={{
                backgroundColor: "var(--ant-color-bg-container)",
              }}
            >
              <Descriptions.Item label="Nombre">
                <Text strong>{role.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Usuarios asignados">
                <Flex align="center" gap={6}>
                  <Users size={14} />
                  <Text>{role.users_count ?? 0}</Text>
                </Flex>
              </Descriptions.Item>
              <Descriptions.Item label="Creado">
                <Flex align="center" gap={6}>
                  <Calendar size={14} />
                  <Text>{role.created_at ?? "—"}</Text>
                </Flex>
              </Descriptions.Item>
              <Descriptions.Item label="Actualizado" span={2}>
                {role.updated_at ?? "—"}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "24px 0 16px" }} />

            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 12 }}
            >
              <Flex align="center" gap={6}>
                <Key size={18} style={{ color: "var(--ant-color-primary)" }} />
                <Text strong>Permisos del rol</Text>
              </Flex>
              <Tag color="blue">{role.permissions.length} permisos</Tag>
            </Flex>

            <div
              style={{
                maxHeight: 280,
                overflowY: "auto",
                padding: 16,
                borderRadius: 12,
                border: "1px solid var(--ant-color-border)",
                backgroundColor: "var(--ant-color-bg-container-secondary)",
                transition: "all 0.2s",
              }}
            >
              {role.permissions.length === 0 ? (
                <Empty
                  description="Sin permisos asignados"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ margin: "16px 0" }}
                />
              ) : (
                <Flex wrap="wrap" gap="small">
                  {role.permissions.map((permission) => (
                    <Tag
                      key={permission.id}
                      color="processing"
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        padding: "2px 10px",
                      }}
                    >
                      {permission.name}
                    </Tag>
                  ))}
                </Flex>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
