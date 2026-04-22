import { useMemo, useState } from "react";
import { Button, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { Copy, Eye, Pencil, Plus, Shield, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { useRoles } from "../hooks/useRoles";
import type { RolDetalle, RolListItem } from "../types/rol.types";
import { RoleFilters } from "./RoleFilters";
import { RoleFormModal } from "./RoleFormModal";
import { RoleDetailModal } from "./RoleDetailModal";
import { RolePermissionsModal } from "./RolePermissionsModal";
import { RoleUsersModal } from "./RoleUsersModal";
import { RoleCopyModal } from "./RoleCopyModal";

type RoleFormMode = "create" | "edit";

const RolesPage = () => {
  const roles = useRoles();

  const [selectedRole, setSelectedRole] = useState<RolListItem | null>(null);
  const [selectedRoleDetail, setSelectedRoleDetail] =
    useState<RolDetalle | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<RoleFormMode>("create");
  const [formInitialName, setFormInitialName] = useState<string>("");
  const [formInitialPermissions, setFormInitialPermissions] = useState<
    number[]
  >([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const paginatedData = useMemo(() => {
    const start = (roles.table.state.page - 1) * roles.table.state.pageSize;
    return roles.data.slice(start, start + roles.table.state.pageSize);
  }, [roles.data, roles.table.state.page, roles.table.state.pageSize]);

  const loadRoleDetail = async (roleId: number) => {
    setLoadingDetail(true);
    const detail = await roles.getRoleDetail(roleId);
    setSelectedRoleDetail(detail);
    setLoadingDetail(false);
    return detail;
  };

  const handleOpenCreate = async () => {
    setFormMode("create");
    setFormInitialName("");
    setFormInitialPermissions([]);
    setSelectedRole(null);
    await roles.fetchPermissionsCatalog();
    setFormOpen(true);
  };

  const handleOpenEdit = async (role: RolListItem) => {
    setSelectedRole(role);
    setFormMode("edit");
    await roles.fetchPermissionsCatalog();
    const detail = await loadRoleDetail(role.id);

    setFormInitialName(detail?.name ?? role.name);
    setFormInitialPermissions(
      detail ? roles.getPermissionIds(detail.permissions) : [],
    );
    setFormOpen(true);
  };

  const handleOpenDetail = async (role: RolListItem) => {
    setSelectedRole(role);
    await loadRoleDetail(role.id);
    setDetailOpen(true);
  };

  const handleOpenPermissions = async (role: RolListItem) => {
    setSelectedRole(role);
    await loadRoleDetail(role.id);
    setPermissionsOpen(true);
  };

  const handleOpenUsers = async (role: RolListItem) => {
    setSelectedRole(role);
    await roles.fetchUsersByRole(role);
    setUsersOpen(true);
  };

  const handleSubmitRole = async (values: {
    name: string;
    permissionIds: number[];
  }) => {
    if (formMode === "create") {
      const ok = await roles.createRole({
        name: values.name,
        guard_name: "api",
        permissions: values.permissionIds,
      });
      if (ok) setFormOpen(false);
      return;
    }

    if (!selectedRole) return;
    const ok = await roles.updateRole(
      selectedRole.id,
      { name: values.name, guard_name: "api" },
      values.permissionIds,
    );
    if (ok) setFormOpen(false);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    const ok = await roles.deleteRole(selectedRole.id);
    if (ok) {
      setDeleteOpen(false);
      setSelectedRole(null);
    }
  };

  const handleCopyRole = async (newName: string) => {
    if (!selectedRole) return;
    const ok = await roles.copyRole(selectedRole.id, newName);
    if (ok) {
      setCopyOpen(false);
      setSelectedRole(null);
    }
  };

  const columns: TableColumnsType<RolListItem> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span
          className="font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "Nro Permisos",
      key: "nroPermisos",
      width: 130,
      align: "center",
      render: (_, r: any) => (
        <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
          {r.permissions_count ?? r.permissions?.length ?? "—"}
        </span>
      ),
    },
    {
      title: "Nro Usuarios",
      dataIndex: "users_count",
      key: "users_count",
      width: 130,
      align: "center",
      render: (value?: number) => (
        <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
          {value ?? 0}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      width: 120,
      render: (_, role) => {
        const estado = roles.getRoleEstado(role);
        return estado === "activo" ? (
          <Tag color="success">Activo</Tag>
        ) : (
          <Tag color="error">Inactivo</Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 250,
      render: (_, role) => (
        <RowActions
          collapseWhenMoreThan={5}
          actions={[
            {
              key: "view",
              label: "Ver",
              icon: <Eye size={14} />,
              permission: "roles.ver",
              onClick: () => handleOpenDetail(role),
            },
            {
              key: "permissions",
              label: "Permisos",
              icon: <Shield size={14} />,
              permission: "roles.ver",
              onClick: () => handleOpenPermissions(role),
            },
            {
              key: "edit",
              label: "Editar",
              icon: <Pencil size={14} />,
              permission: "roles.editar",
              onClick: () => handleOpenEdit(role),
            },
            {
              key: "users",
              label: "Usuarios con ese rol",
              icon: <Users size={14} />,
              permission: "usuarios.ver",
              onClick: () => handleOpenUsers(role),
            },
            {
              key: "copy",
              label: "Copiar rol",
              icon: <Copy size={14} />,
              permission: "roles.crear",
              onClick: () => {
                setSelectedRole(role);
                setCopyOpen(true);
              },
            },
            {
              key: "delete",
              label: "Eliminar",
              icon: <Trash2 size={14} />,
              permission: "roles.eliminar",
              danger: true,
              onClick: () => {
                setSelectedRole(role);
                setDeleteOpen(true);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Gestión de Roles"
        description="Administra roles, permisos, asignaciones de usuarios y copias de rol"
        breadcrumbs={[{ label: "Seguridad y Accesos" }, { label: "Roles" }]}
        actions={
          <Can permission="roles.crear">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleOpenCreate}
            >
              Crear Rol
            </Button>
          </Can>
        }
      />

      <RoleFilters
        search={roles.table.state.search}
        filters={roles.table.state.filters}
        onSearch={roles.table.setSearch}
        onFilterChange={roles.table.setFilters}
        onReset={roles.table.reset}
      />

      <DataTable<RolListItem>
        rowKey="id"
        columns={columns}
        data={paginatedData}
        loading={roles.loading}
        emptyText="No hay roles registrados"
        scrollX={1000}
        pagination={{
          current: roles.table.state.page,
          pageSize: roles.table.state.pageSize,
          total: roles.total,
          onChange: roles.table.setPage,
        }}
      />

      <RoleFormModal
        open={formOpen}
        mode={formMode}
        loading={roles.loadingPermissions || loadingDetail}
        submitting={roles.submitting}
        permissions={roles.permissionsCatalog}
        initialName={formInitialName}
        initialPermissionIds={formInitialPermissions}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmitRole}
      />

      <RoleDetailModal
        open={detailOpen}
        role={selectedRoleDetail}
        onClose={() => setDetailOpen(false)}
      />

      <RolePermissionsModal
        open={permissionsOpen}
        role={selectedRoleDetail}
        onClose={() => setPermissionsOpen(false)}
        onEdit={async (roleDetail) => {
          setPermissionsOpen(false);
          await handleOpenEdit(roleDetail);
        }}
      />

      <RoleUsersModal
        open={usersOpen}
        role={selectedRole}
        users={roles.roleUsers}
        loading={roles.loadingRoleUsers}
        onClose={() => {
          setUsersOpen(false);
          roles.clearRoleUsers();
        }}
      />

      <RoleCopyModal
        open={copyOpen}
        sourceRoleName={selectedRole?.name}
        loading={roles.submitting}
        onCancel={() => setCopyOpen(false)}
        onConfirm={handleCopyRole}
      />

      <ConfirmModal
        open={deleteOpen}
        title="¿Eliminar rol?"
        description={`Se eliminará el rol ${selectedRole?.name ?? ""}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={roles.submitting}
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteRole}
      />
    </div>
  );
};

export default RolesPage;
