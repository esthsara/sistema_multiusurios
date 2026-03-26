import { useMemo, useState } from "react";
import { Button, Tag, Statistic, Row, Col } from "antd";
import type { TableColumnsType } from "antd";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { usePermisos } from "../hooks/usePermisos";
import type { PermisoItem } from "../types/permiso.types";
import { PermisoFilters } from "./PermisoFilters";
import { PermisoFormModal } from "./PermisoFormModal";

type PermisoFormMode = "create" | "edit";

const PermisosPage = () => {
  const permisos = usePermisos();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<PermisoFormMode>("create");
  const [selectedPermiso, setSelectedPermiso] = useState<PermisoItem | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const paginatedData = useMemo(() => {
    const start =
      (permisos.table.state.page - 1) * permisos.table.state.pageSize;
    return permisos.data.slice(start, start + permisos.table.state.pageSize);
  }, [permisos.data, permisos.table.state.page, permisos.table.state.pageSize]);

  const handleOpenCreate = async () => {
    setFormMode("create");
    setSelectedPermiso(null);
    await permisos.fetchAgrupados();
    setFormOpen(true);
  };

  const handleOpenEdit = async (permiso: PermisoItem) => {
    setFormMode("edit");
    setSelectedPermiso(permiso);
    await permisos.fetchAgrupados();
    setFormOpen(true);
  };

  const handleSubmitPermiso = async (values: {
    name: string;
    modulo?: string;
    accion?: string;
    guard_name?: string;
  }) => {
    // Construir el nombre si viene separado
    let finalName = values.name;
    if (values.modulo && values.accion) {
      finalName = `${values.modulo}.${values.accion}`;
    }

    if (formMode === "create") {
      const ok = await permisos.createPermiso({
        name: finalName,
        guard_name: values.guard_name ?? "api",
      });
      if (ok) setFormOpen(false);
      return;
    }

    // Para editar, solo actualizamos el nombre
    if (!selectedPermiso) return;
    const ok = await permisos.updatePermiso(selectedPermiso.id, {
      name: finalName,
      guard_name: values.guard_name ?? "api",
    });
    if (ok) setFormOpen(false);
  };

  const handleDeletePermiso = async () => {
    if (!selectedPermiso) return;
    const ok = await permisos.deletePermiso(selectedPermiso.id);
    if (ok) {
      setDeleteOpen(false);
      setSelectedPermiso(null);
    }
  };

  const columns: TableColumnsType<PermisoItem> = [
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
      title: "Código",
      dataIndex: "name",
      key: "codigo",
      width: 180,
      render: (name: string) => <Tag color="geekblue">{name}</Tag>,
    },
    {
      title: "Módulo",
      dataIndex: "modulo",
      key: "modulo",
      width: 140,
      render: (modulo: string) => <Tag color="cyan">{modulo}</Tag>,
    },
    {
      title: "Acción",
      dataIndex: "accion",
      key: "accion",
      width: 120,
      render: (accion: string) => <Tag color="volcano">{accion}</Tag>,
    },
    {
      title: "Estado",
      key: "estado",
      width: 100,
      render: () => <Tag color="success">Activo</Tag>,
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 200,
      render: (_, permiso) => (
        <RowActions
          collapseWhenMoreThan={5}
          actions={[
            {
              key: "edit",
              label: "Editar",
              icon: <Pencil size={14} />,
              permission: "permisos.editar",
              onClick: () => handleOpenEdit(permiso),
            },
            {
              key: "delete",
              label: "Eliminar",
              icon: <Trash2 size={14} />,
              permission: "permisos.eliminar",
              danger: true,
              onClick: () => {
                setSelectedPermiso(permiso);
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
        title="Gestión de Permisos"
        description="Administra todos los permisos del sistema"
        breadcrumbs={[{ label: "Seguridad y Accesos" }, { label: "Permisos" }]}
        actions={
          <Can permission="permisos.crear">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleOpenCreate}
            >
              Crear Permiso
            </Button>
          </Can>
        }
      />

      <Row gutter={16} className="mb-6">
        <Col xs={12} sm={6} md={4}>
          <Statistic
            title="Total Módulos"
            value={permisos.moduloCount}
            valueStyle={{ color: "var(--color-primary-600)" }}
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Statistic
            title="Total de Acciones"
            value={permisos.accionCount}
            valueStyle={{ color: "var(--color-success-600)" }}
          />
        </Col>
      </Row>

      <PermisoFilters
        search={permisos.table.state.search}
        modulos={permisos.modulos}
        selectedModulo={permisos.table.state.filters?.modulo}
        onSearch={permisos.table.setSearch}
        onModuloChange={(modulo) =>
          permisos.table.setFilters({ modulo: modulo || "" })
        }
        onReset={permisos.table.reset}
      />

      <DataTable<PermisoItem>
        rowKey="id"
        columns={columns}
        data={paginatedData}
        loading={permisos.loading}
        emptyText="No hay permisos registrados"
        scrollX={1100}
        pagination={{
          current: permisos.table.state.page,
          pageSize: permisos.table.state.pageSize,
          total: permisos.total,
          onChange: permisos.table.setPage,
        }}
      />

      <PermisoFormModal
        open={formOpen}
        mode={formMode}
        loading={false}
        submitting={permisos.submitting}
        modulos={permisos.modulos}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmitPermiso}
      />

      <ConfirmModal
        open={deleteOpen}
        title="¿Eliminar permiso?"
        description={`Se eliminará el permiso ${selectedPermiso?.name ?? ""}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={permisos.submitting}
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeletePermiso}
      />
    </div>
  );
};

export default PermisosPage;
