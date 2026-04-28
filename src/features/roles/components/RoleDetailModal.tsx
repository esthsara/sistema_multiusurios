// src/features/roles/components/RoleDetailModal.tsx
import {
  Empty,
  Modal,
  Tag,
  Typography,
  Flex,
  Divider,
  Card,
  Row,
  Col,
  theme,
} from "antd";
import { ShieldCheck, Users, Calendar, Key } from "lucide-react";
import type { RolDetalle } from "../types/rol.types";
import { agruparPermisosPorModulo } from "../utils/roles.utils";

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
  const { token } = theme.useToken();

  const groupedPermissions = agruparPermisosPorModulo(role?.permissions ?? []);

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={820}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap={12}>
          <ShieldCheck size={24} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Detalle del rol
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Información general y permisos asignados
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: 0 },
      }}
    >
      {!role ? (
        <Empty
          description="No hay información del rol"
          style={{ padding: 40 }}
        />
      ) : (
        <div>
          {/* ───────── HEADER INFO ───────── */}
          <div style={{ padding: "20px 24px 0" }}>
            <Row gutter={[12, 12]}>
              {/* Nombre */}
              <Col xs={24}>
                <Card
                  size="small"
                  style={{
                    borderRadius: 10,
                    background: token.colorFillTertiary,
                  }}
                >
                  <Text type="secondary">Nombre del rol</Text>
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    {role.name}
                  </Title>
                </Card>
              </Col>

              {/* Usuarios */}
              <Col xs={24} sm={8}>
                <Card size="small" style={{ borderRadius: 10 }}>
                  <Flex align="center" gap={8}>
                    <Users size={16} />
                    <Text type="secondary">Usuarios</Text>
                  </Flex>
                  <Title level={4} style={{ margin: 0 }}>
                    {role.users_count ?? 0}
                  </Title>
                </Card>
              </Col>

              {/* Creado */}
              <Col xs={24} sm={8}>
                <Card size="small" style={{ borderRadius: 10 }}>
                  <Flex align="center" gap={8}>
                    <Calendar size={16} />
                    <Text type="secondary">Creado</Text>
                  </Flex>
                  <Text>{role.created_at ?? "—"}</Text>
                </Card>
              </Col>

              {/* Actualizado */}
              <Col xs={24} sm={8}>
                <Card size="small" style={{ borderRadius: 10 }}>
                  <Flex align="center" gap={8}>
                    <Calendar size={16} />
                    <Text type="secondary">Actualizado</Text>
                  </Flex>
                  <Text>{role.updated_at ?? "—"}</Text>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "20px 0 12px" }} />

          {/* ───────── PERMISOS ───────── */}
          <div style={{ padding: "0 24px 24px" }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 12 }}
            >
              <Flex align="center" gap={8}>
                <Key size={18} style={{ color: token.colorPrimary }} />
                <Text strong>Permisos del rol</Text>
              </Flex>
              <Tag color="blue">{role.permissions.length} permisos</Tag>
            </Flex>

            <div
              style={{
                maxHeight: 320,
                overflowY: "auto",
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${token.colorBorder}`,
                background: token.colorBgContainer,
              }}
            >
              {groupedPermissions.length === 0 ? (
                <Empty
                  description="Sin permisos asignados"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Flex direction="column" gap={12}>
                  {groupedPermissions.map((group) => (
                    <Card
                      key={group.module}
                      size="small"
                      style={{
                        borderRadius: 10,
                        background: token.colorFillQuaternary,
                      }}
                    >
                      {/* MÓDULO */}
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 8,
                          textTransform: "capitalize",
                        }}
                      >
                        {group.module}
                      </Text>

                      {/* PERMISOS */}
                      <Flex wrap="wrap" gap={6}>
                        {group.permissions.map((p) => (
                          <Tag
                            key={p.id}
                            color="processing"
                            style={{
                              margin: 0,
                              borderRadius: 6,
                              fontSize: 12,
                              padding: "3px 10px",
                            }}
                          >
                            {p.name}
                          </Tag>
                        ))}
                      </Flex>
                    </Card>
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

export default RoleDetailModal;
