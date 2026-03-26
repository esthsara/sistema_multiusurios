import { Empty, Modal, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import type { RolDetalle, RolPermission } from "../types/rol.types";

interface RolePermissionsModalProps {
  open: boolean;
  role: RolDetalle | null;
  onClose: () => void;
}

export const RolePermissionsModal = ({
  open,
  role,
  onClose,
}: RolePermissionsModalProps) => {
  const columns: TableColumnsType<RolPermission> = [
    {
      title: "Permiso",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <Tag color="geekblue">{value}</Tag>,
    },
    {
      title: "Módulo",
      dataIndex: "modulo",
      key: "modulo",
      width: 180,
      render: (value?: string) => value || "—",
    },
    {
      title: "Acción",
      dataIndex: "accion",
      key: "accion",
      width: 140,
      render: (value?: string) => value || "—",
    },
  ];

  return (
    <Modal
      open={open}
      title={role ? `Permisos de ${role.name}` : "Permisos del rol"}
      footer={null}
      onCancel={onClose}
      width={820}
      destroyOnHidden
    >
      {!role ? (
        <Empty description="No hay rol seleccionado" />
      ) : (
        <Table<RolPermission>
          rowKey="id"
          columns={columns}
          dataSource={role.permissions}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: "Este rol no tiene permisos" }}
          size="small"
        />
      )}
    </Modal>
  );
};
