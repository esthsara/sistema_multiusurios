import {
  Empty,
  Modal,
  Table,
  Tag,
  Typography,
  Flex,
  Avatar,
  Space,
  theme,
} from "antd";
import type { TableColumnsType } from "antd";
import { Users, Mail, CheckCircle, XCircle } from "lucide-react";
import type { RolListItem, RolUsuarioItem } from "../types/rol.types";

const { Title, Text } = Typography;

interface RoleUsersModalProps {
  open: boolean;
  role: RolListItem | null;
  loading: boolean;
  users: RolUsuarioItem[];
  onClose: () => void;
}

const getDisplayName = (user: RolUsuarioItem) => {
  const persona = user.persona;
  if (!persona) return user.username;

  if (persona.nombre_completo) return persona.nombre_completo;
  if (persona.razon_social) return persona.razon_social;

  const fullName = `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim();
  return fullName || user.username;
};

const getUserInitials = (user: RolUsuarioItem): string => {
  const name = getDisplayName(user);
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const RoleUsersModal = ({
  open,
  role,
  loading,
  users,
  onClose,
}: RoleUsersModalProps) => {
  const { token } = theme.useToken();

  const columns: TableColumnsType<RolUsuarioItem> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, user) => (
        <Flex align="center" gap="middle">
          <Avatar
            size={40}
            style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }}
          >
            {getUserInitials(user)}
          </Avatar>
          <Flex vertical gap={4}>
            <Text strong>{getDisplayName(user)}</Text>
            <Space size="small">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                @{user.username}
              </Text>
              {user.email && (
                <>
                  <Tag
                    icon={<Mail size={12} />}
                    color="default"
                    style={{ fontSize: "11px" }}
                  >
                    {user.email}
                  </Tag>
                </>
              )}
            </Space>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      width: 120,
      align: "center",
      render: (activo?: boolean) =>
        activo ? (
          <Tag
            icon={<CheckCircle size={12} />}
            color="success"
            style={{ borderRadius: 16, padding: "2px 12px" }}
          >
            Activo
          </Tag>
        ) : (
          <Tag
            icon={<XCircle size={12} />}
            color="error"
            style={{ borderRadius: 16, padding: "2px 12px" }}
          >
            Inactivo
          </Tag>
        ),
    },
  ];

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={820}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap="middle">
          <Users size={24} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {role
                ? `Usuarios con rol: ${role.name}`
                : "Usuarios con este rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Listado de usuarios asignados a este rol
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: "24px" },
      }}
    >
      <Table<RolUsuarioItem>
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        size="middle"
        locale={{
          emptyText: (
            <Empty
              description={
                role
                  ? `No hay usuarios asignados al rol ${role.name}`
                  : "No hay usuarios"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "32px 0" }}
            />
          ),
        }}
        rowClassName={() => "user-row"}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: token.colorBgLayout,
                  fontWeight: 600,
                }}
              />
            ),
          },
        }}
      />
    </Modal>
  );
};
