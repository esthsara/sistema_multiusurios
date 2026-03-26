// src/features/asignaciones/components/AsignacionesPage.tsx
import { useEffect, useState } from "react";
import { Button, Table, Tag, Popconfirm, Space, Select, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { Can } from "@/shared/components/atoms/Can";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { AsignacionFilters } from "./AsignacionFilters";
import { AsignacionModal } from "./AsignacionModal";
import type { AsignacionListItem } from "../types/asignacion.types";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import { rolesService } from "@/features/roles/services/roles.service";

export const AsignacionesPage = () => {
  const { data, total, loading, table, fetchAsignaciones, create, remove } =
    useAsignaciones();

  const [modalOpen, setModalOpen] = useState(false);
  const [sucursales, setSucursales] = useState<
    Array<{ id: number; nombre: string; codigo: string }>
  >([]);
  const [usuarios, setUsuarios] = useState<
    Array<{ id: number; username: string; email: string }>
  >([]);
  const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingSelects, setLoadingSelects] = useState({
    sucursales: false,
    usuarios: false,
    roles: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<AsignacionListItem | null>(
    null,
  );
  const [editingRol, setEditingRol] = useState<{
    id: number;
    rolId: number;
  } | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar asignaciones cuando se abre el modal
  useEffect(() => {
    if (modalOpen) {
      loadSelectors();
    }
  }, [modalOpen]);

  // Fetch de asignaciones cuando cambian los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAsignaciones();
    }, 300);
    return () => clearTimeout(timer);
  }, [table.state, fetchAsignaciones]);

  const loadInitialData = async () => {
    try {
      const [sucRes, rolRes] = await Promise.all([
        sucursalesService.getAll({}),
        rolesService.getAll({}),
      ]);
      setSucursales(
        (sucRes.data ?? []).map((s: any) => ({
          id: s.id,
          nombre: s.nombre,
          codigo: s.codigo,
        })),
      );
      setRoles(
        (rolRes.data.items ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
        })),
      );
    } catch {
      // Error silencioso
    }
  };

  const loadSelectors = async () => {
    setLoadingSelects({ sucursales: true, usuarios: true, roles: true });
    try {
      const [sucRes, usRes, rolRes] = await Promise.all([
        sucursalesService.getAll({}),
        usuariosService.getAll({}),
        rolesService.getAll({}),
      ]);

      setSucursales(
        (sucRes.data ?? []).map((s: any) => ({
          id: s.id,
          nombre: s.nombre,
          codigo: s.codigo,
        })),
      );
      setUsuarios(
        (usRes.data ?? []).map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
        })),
      );
      setRoles(
        (rolRes.data.items ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
        })),
      );
    } finally {
      setLoadingSelects({ sucursales: false, usuarios: false, roles: false });
    }
  };

  const handleCreateAsignacion = async (data: {
    usuario_id: number;
    sucursal_id: number;
    rol_id: number;
    es_administrador: boolean;
  }) => {
    const success = await create(
      data.usuario_id,
      data.sucursal_id,
      data.rol_id,
    );
    if (success) {
      setModalOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns: TableColumnsType<AsignacionListItem> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, r) => (
        <div>
          <p
            className="m-0 font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            @{r.usuario.username}
          </p>
          <p
            className="m-0 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.usuario.email}
          </p>
        </div>
      ),
    },
    {
      title: "Sucursal",
      key: "sucursal",
      width: 200,
      render: (_, r) => (
        <div>
          <p
            className="m-0 font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {r.sucursal.nombre}
          </p>
          <p
            className="m-0 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.sucursal.codigo}
          </p>
        </div>
      ),
    },
    {
      title: "Rol",
      key: "rol",
      width: 180,
      render: (_, r) =>
        editingRol?.id === r.id ? (
          <Select
            value={editingRol.rolId}
            onChange={(value) => setEditingRol({ ...editingRol, rolId: value })}
            options={roles.map((ro) => ({
              value: ro.id,
              label: ro.name,
            }))}
            style={{ width: "100%" }}
            autoFocus
            onBlur={() => setEditingRol(null)}
          />
        ) : (
          <Tag>{r.rol.name}</Tag>
        ),
    },
    {
      title: "Admin",
      key: "administrador",
      width: 90,
      render: (_, r) => (
        <Tag color={r.es_administrador ? "blue" : "default"}>
          {r.es_administrador ? "Sí" : "No"}
        </Tag>
      ),
    },
    {
      title: "Estado",
      key: "activo",
      width: 100,
      render: (_, r) => (
        <Tag color={r.activo ? "green" : "red"}>
          {r.activo ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 120,
      render: (_, r) => (
        <Space>
          <Can permission="asignaciones.editar">
            <Tooltip title="Editar rol">
              <Button
                type="text"
                icon={<Edit2 size={14} />}
                onClick={() => setEditingRol({ id: r.id, rolId: r.rol_id })}
              />
            </Tooltip>
          </Can>
          <Can permission="asignaciones.eliminar">
            <Popconfirm
              title="Quitar asignación"
              description={`¿Deseas quitar a ${r.usuario.username} de ${r.sucursal.nombre}?`}
              okText="Quitar"
              cancelText="Cancelar"
              onConfirm={() => remove(r.id)}
            >
              <Button type="text" danger icon={<Trash2 size={14} />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Asignaciones Usuario-Sucursal"
        description="Gestiona la asignación de usuarios a sucursales y sus roles"
        breadcrumbs={[
          { label: "Gestión Organizacional" },
          { label: "Asignaciones Usuario-Sucursal" },
        ]}
        actions={
          <Can permission="asignaciones.crear">
            <Button
              type="primary"
              icon={<Plus size={15} />}
              onClick={() => setModalOpen(true)}
            >
              Nueva Asignación
            </Button>
          </Can>
        }
      />

      <div className="mt-6 space-y-4">
        <AsignacionFilters
          filters={table.state}
          onFilterChange={(filters) => table.setFilters(filters)}
          sucursales={sucursales}
          roles={roles}
          loading={loading}
        />

        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={{
            current: table.state.page,
            pageSize: table.state.pageSize,
            total: total,
            onChange: (page, pageSize) => {
              table.setPage(page, pageSize);
            },
          }}
          size="small"
          style={{
            backgroundColor: "var(--color-bg-base)",
            borderRadius: "var(--radius-card)",
          }}
        />
      </div>

      <AsignacionModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        usuarios={usuarios}
        sucursales={sucursales}
        roles={roles}
        loadingUsers={loadingSelects.usuarios}
        loadingSucursales={loadingSelects.sucursales}
        loadingRoles={loadingSelects.roles}
        onSubmit={handleCreateAsignacion}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Quitar asignación?"
        description={`Se quitará a ${deleteTarget?.usuario.username} de ${deleteTarget?.sucursal.nombre}`}
        confirmText="Quitar"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AsignacionesPage;
