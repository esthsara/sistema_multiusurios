import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  theme,
  Badge,
  Flex,
} from "antd";
import { Pencil, ShieldCheck, Key, LayoutGrid, Zap } from "lucide-react";
import type { RolDetalle, RolPermission } from "../types/rol.types";
import { Divider } from "antd";

const { Title, Text } = Typography;

interface RolePermissionsModalProps {
  open: boolean;
  role: RolDetalle | null;
  onClose: () => void;
  onEdit?: (role: RolDetalle) => void;
}

const toReadableLabel = (value?: string) => {
  if (!value) return "Sin definir";
  const normalized = value.replace(/[_-]+/g, " ").replace(/\./g, " ").trim();
  if (!normalized) return "Sin definir";
  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
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
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const moduleGroups = useMemo(() => {
    if (!role) return [];

    const grouped = role.permissions.reduce<
      Record<
        string,
        { module: string; permissions: RolPermission[]; actions: Set<string> }
      >
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
    moduleGroups.forEach((group) =>
      group.actions.forEach((a) => actions.add(a)),
    );
    return actions.size;
  }, [moduleGroups]);

  // Items para el Collapse
  const collapseItems = moduleGroups.map((group) => ({
    key: group.module,
    label: (
      <Flex justify="space-between" align="center">
        <Space>
          <LayoutGrid size={16} />
          <Text strong>{group.module}</Text>
        </Space>
        <Space>
          <Tag icon={<Key size={12} />} color="blue">
            {group.permissions.length} permisos
          </Tag>
          <Tag icon={<Zap size={12} />} color="geekblue">
            {group.actions.size} acciones
          </Tag>
        </Space>
      </Flex>
    ),
    children: (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Flex wrap="wrap" gap="small">
          {[...group.actions]
            .sort((a, b) => a.localeCompare(b, "es"))
            .map((action) => (
              <Tag key={action} color="processing" style={{ margin: 0 }}>
                {action}
              </Tag>
            ))}
        </Flex>
        <Divider style={{ margin: "8px 0" }} />
        <Flex wrap="wrap" gap="small">
          {group.permissions.map((permission) => (
            <Tag
              key={permission.id}
              color="default"
              style={{ margin: 0, fontSize: "12px" }}
            >
              {permission.name}
            </Tag>
          ))}
        </Flex>
      </Space>
    ),
  }));

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={900}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap="middle">
          <ShieldCheck size={24} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {role ? `Permisos del rol: ${role.name}` : "Permisos del rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Listado de módulos, acciones y permisos asignados
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
        <Empty description="No hay rol seleccionado" style={{ padding: 40 }} />
      ) : (
        <div>
          {/* Estadísticas */}
          <div style={{ padding: "24px 24px 0 24px" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card
                  size="small"
                  style={{
                    background: token.colorFillTertiary,
                    border: "none",
                  }}
                >
                  <Text type="secondary">Permisos activos</Text>
                  <Title
                    level={3}
                    style={{ margin: 0, color: token.colorPrimary }}
                  >
                    {totalPermissions}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  size="small"
                  style={{
                    background: token.colorFillTertiary,
                    border: "none",
                  }}
                >
                  <Text type="secondary">Módulos cubiertos</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {totalModules}
                  </Title>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  size="small"
                  style={{
                    background: token.colorFillTertiary,
                    border: "none",
                  }}
                >
                  <Text type="secondary">Acciones identificadas</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {totalActions}
                  </Title>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Lista de permisos por módulo (Collapse) */}
          <div style={{ padding: 24 }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
            >
              <Space>
                <Key size={18} />
                <Text strong>Permisos por módulo</Text>
              </Space>
              <Badge count={moduleGroups.length} showZero color="blue" />
            </Flex>

            {moduleGroups.length === 0 ? (
              <Card>
                <Empty
                  description="Este rol no tiene permisos asignados"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            ) : (
              <Collapse
                items={collapseItems}
                activeKey={activeKeys}
                onChange={(keys) => setActiveKeys(keys as string[])}
                expandIconPosition="end"
                ghost={false}
                bordered
                style={{ background: token.colorBgContainer }}
              />
            )}
          </div>

          {/* Footer con botón de editar (si existe) */}
          {onEdit && (
            <Flex
              justify="end"
              style={{
                padding: "16px 24px 24px",
                borderTop: `1px solid ${token.colorBorder}`,
              }}
            >
              <Button
                type="primary"
                icon={<Pencil size={16} />}
                onClick={() => onEdit(role)}
              >
                Editar permisos
              </Button>
            </Flex>
          )}
        </div>
      )}
    </Modal>
  );
};
