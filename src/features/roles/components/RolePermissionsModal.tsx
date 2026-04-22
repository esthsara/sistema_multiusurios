import { useMemo } from "react";
import { Button, Card, Col, Empty, Modal, Row, Space, Tag, Typography, theme } from "antd";
import { Pencil, ShieldCheck } from "lucide-react";
import type { RolDetalle, RolPermission } from "../types/rol.types";

interface RolePermissionsModalProps {
  open: boolean;
  role: RolDetalle | null;
  onClose: () => void;
  onEdit?: (role: RolDetalle) => void;
}

const toReadableLabel = (value?: string) => {
  if (!value) return "Sin definir";
  const normalized = value
    .replace(/[_-]+/g, " ")
    .replace(/\./g, " ")
    .trim();

  if (!normalized) return "Sin definir";

  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getModuleName = (permission: RolPermission) => {
  if (permission.modulo?.trim()) return toReadableLabel(permission.modulo);

  const [moduleFromName] = String(permission.name ?? "").split(".");
  return toReadableLabel(moduleFromName);
};

const getActionName = (permission: RolPermission) => {
  if (permission.accion?.trim()) return toReadableLabel(permission.accion);

  const [, ...actionParts] = String(permission.name ?? "").split(".");
  return toReadableLabel(actionParts.join("."));
};

export const RolePermissionsModal = ({
  open,
  role,
  onClose,
  onEdit,
}: RolePermissionsModalProps) => {
  const { token } = theme.useToken();

  const moduleGroups = useMemo(() => {
    if (!role) return [];

    const grouped = role.permissions.reduce<
      Record<string, { module: string; permissions: RolPermission[]; actions: Set<string> }>
    >((acc, permission) => {
      const module = getModuleName(permission);
      const action = getActionName(permission);

      if (!acc[module]) {
        acc[module] = { module, permissions: [], actions: new Set<string>() };
      }

      acc[module].permissions.push(permission);
      acc[module].actions.add(action);

      return acc;
    }, {});

    return Object.values(grouped)
      .map((group) => ({
        ...group,
        permissions: [...group.permissions].sort((a, b) =>
          String(a.name).localeCompare(String(b.name), "es"),
        ),
      }))
      .sort((a, b) => a.module.localeCompare(b.module, "es"));
  }, [role]);

  const totalModules = moduleGroups.length;
  const totalPermissions = role?.permissions.length ?? 0;
  const totalActions = useMemo(() => {
    const actions = new Set<string>();
    moduleGroups.forEach((group) => {
      group.actions.forEach((action) => actions.add(action));
    });
    return actions.size;
  }, [moduleGroups]);

  return (
    <Modal
      open={open}
      title={role ? `Permisos del rol: ${role.name}` : "Permisos del rol"}
      footer={
        role && onEdit ? (
          <Button type="primary" icon={<Pencil size={16} />} onClick={() => onEdit(role)}>
            Editar permisos
          </Button>
        ) : null
      }
      onCancel={onClose}
      width={900}
      centered
      destroyOnHidden
    >
      {!role ? (
        <Empty description="No hay rol seleccionado" />
      ) : (
        <div className="pt-2">
          <div
            style={{
              border: `1px solid ${token.colorBorder}`,
              background: token.colorFillTertiary,
              borderRadius: token.borderRadiusLG,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <Space size={10} className="mb-2">
              <ShieldCheck size={18} color={token.colorPrimary} />
              <Typography.Text strong style={{ color: token.colorText }}>
                Vista general de permisos
              </Typography.Text>
            </Space>

            <Row gutter={[12, 12]}>
              <Col xs={24} sm={8}>
                <Card size="small" bordered={false} style={{ background: token.colorBgElevated }}>
                  <Typography.Text type="secondary">Permisos activos</Typography.Text>
                  <Typography.Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
                    {totalPermissions}
                  </Typography.Title>
                </Card>
              </Col>

              <Col xs={24} sm={8}>
                <Card size="small" bordered={false} style={{ background: token.colorBgElevated }}>
                  <Typography.Text type="secondary">Módulos cubiertos</Typography.Text>
                  <Typography.Title level={4} style={{ margin: 0, color: token.colorText }}>
                    {totalModules}
                  </Typography.Title>
                </Card>
              </Col>

              <Col xs={24} sm={8}>
                <Card size="small" bordered={false} style={{ background: token.colorBgElevated }}>
                  <Typography.Text type="secondary">Acciones identificadas</Typography.Text>
                  <Typography.Title level={4} style={{ margin: 0, color: token.colorText }}>
                    {totalActions}
                  </Typography.Title>
                </Card>
              </Col>
            </Row>
          </div>

          <Typography.Text
            strong
            style={{ color: token.colorText, display: "block", marginBottom: 10 }}
          >
            Permisos por módulo
          </Typography.Text>

          <div
            style={{
              maxHeight: 420,
              overflowY: "auto",
              display: "grid",
              gap: 12,
              paddingRight: 4,
            }}
          >
            {moduleGroups.length === 0 ? (
              <Card>
                <Empty
                  description="Este rol no tiene permisos asignados"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            ) : (
              moduleGroups.map((group) => (
                <Card
                  key={group.module}
                  size="small"
                  title={
                    <Space size={8}>
                      <Typography.Text strong style={{ color: token.colorText }}>
                        {group.module}
                      </Typography.Text>
                      <Tag color="blue">{group.permissions.length} permisos</Tag>
                    </Space>
                  }
                  style={{
                    borderColor: token.colorBorder,
                    background: token.colorBgElevated,
                  }}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[...group.actions].sort((a, b) => a.localeCompare(b, "es")).map((action) => (
                      <Tag key={`${group.module}-${action}`} color="processing">
                        {action}
                      </Tag>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.permissions.map((permission) => (
                      <Tag key={permission.id} color="geekblue">
                        {permission.name}
                      </Tag>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
