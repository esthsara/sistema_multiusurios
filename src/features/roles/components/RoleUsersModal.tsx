import { Empty, Modal, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import type { RolListItem, RolUsuarioItem } from "../types/rol.types";

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

export const RoleUsersModal = ({
  open,
  role,
  loading,
  users,
  onClose,
}: RoleUsersModalProps) => {
  const columns: TableColumnsType<RolUsuarioItem> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, user) => (
        <div>
          <p
            className="m-0 font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {getDisplayName(user)}
          </p>
          <p
            className="m-0 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            @{user.username}
          </p>
        </div>
      ),
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      width: 120,
      render: (activo?: boolean) =>
        activo ? (
          <Tag color="success">Activo</Tag>
        ) : (
          <Tag color="error">Inactivo</Tag>
        ),
    },
  ];

  return (
    <Modal
      open={open}
      title={role ? `Usuarios con rol ${role.name}` : "Usuarios con este rol"}
      footer={null}
      onCancel={onClose}
      width={820}
      destroyOnHidden
    >
      <Table<RolUsuarioItem>
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        size="small"
        locale={{
          emptyText: (
            <Empty
              description={
                role
                  ? `No hay usuarios asignados al rol ${role.name}`
                  : "No hay usuarios"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </Modal>
  );
};
