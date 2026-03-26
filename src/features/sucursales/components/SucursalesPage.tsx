import { useState } from "react";
import { Avatar, Button, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { Eye, Pencil, Plus, PowerOff, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { Can } from "@/shared/components/atoms/Can";
import { useSucursales } from "../hooks/useSucursales";
import { useSucursalForm } from "../hooks/useSucursalForm";
import { SucursalFiltersBar } from "./SucursalFilters";
import { SucursalStatusBadge } from "./SucursalStatusBadge";
import { SucursalFormModal } from "./SucursalFormModal";
import type { SucursalListItem } from "../types/sucursal.types";

const SucursalesPage = () => {
  const sucursales = useSucursales();
  const form = useSucursalForm(sucursales.fetchSucursales);

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: "toggle" | "delete" | null;
    item: SucursalListItem | null;
    loading: boolean;
  }>({ open: false, type: null, item: null, loading: false });

  const openConfirm = (type: "toggle" | "delete", item: SucursalListItem) =>
    setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item || !confirmState.type) return;

    setConfirmState((prev) => ({ ...prev, loading: true }));

    if (confirmState.type === "toggle") {
      await sucursales.toggleEstado(confirmState.item);
    } else {
      await sucursales.remove(confirmState.item.id);
    }

    closeConfirm();
  };

  const columns: TableColumnsType<SucursalListItem> = [
    {
      title: "Sucursal",
      key: "nombre",
      dataIndex: "nombre",
      sorter: true,
      sortOrder:
        sucursales.table.state.sort?.field === "nombre"
          ? sucursales.table.state.sort.direction === "asc"
            ? "ascend"
            : "descend"
          : null,
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={r.logo ?? undefined}
            style={{
              backgroundColor: "var(--color-primary-100)",
              color: "var(--color-primary-700)",
              fontWeight: 700,
            }}
          >
            {r.nombre.slice(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <p
              className="m-0 font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {r.nombre}
            </p>
            <p
              className="m-0 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {r.codigo}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
      width: 260,
      render: (value: string) => (
        <span style={{ color: "var(--color-text-secondary)" }}>{value}</span>
      ),
    },
    {
      title: "Horario",
      key: "horario",
      width: 160,
      render: (_, r) => (
        <span style={{ color: "var(--color-text-secondary)" }}>
          {r.horario ||
            `${r.horario_apertura ?? ""} - ${r.horario_cierre ?? ""}`.trim()}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "activa",
      width: 120,
      render: (_, r) => <SucursalStatusBadge activa={r.activa} />,
    },
    {
      title: "Registro",
      key: "created_at",
      width: 170,
      render: (_, r) => (
        <Tooltip title={r.created_at ?? ""}>
          <span style={{ color: "var(--color-text-secondary)" }}>
            {r.created_at_humano ?? "—"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 170,
      render: (_, record) => {
        const actions = [
          {
            key: "view",
            permission: "sucursales.ver" as const,
            label: "Ver",
            icon: <Eye size={14} />,
            onClick: () => toast.info("Vista detalle disponible próximamente"),
          },
          {
            key: "edit",
            permission: "sucursales.editar" as const,
            label: "Editar",
            icon: <Pencil size={14} />,
            onClick: () => form.handleEdit(record),
          },
          {
            key: "toggle",
            permission: "sucursales.editar" as const,
            label: record.activa ? "Desactivar" : "Activar",
            icon: record.activa ? (
              <PowerOff
                size={14}
                style={{ color: "var(--color-warning-500)" }}
              />
            ) : (
              <RotateCcw
                size={14}
                style={{ color: "var(--color-success-500)" }}
              />
            ),
            onClick: () => openConfirm("toggle", record),
          },
          {
            key: "delete",
            permission: "sucursales.eliminar" as const,
            label: "Eliminar",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => openConfirm("delete", record),
          },
        ];

        return <RowActions actions={actions} />;
      },
    },
  ];

  const confirmConfig = {
    toggle: {
      title: confirmState.item?.activa
        ? "¿Deseas desactivar esta sucursal?"
        : "¿Deseas activar esta sucursal nuevamente?",
      description: confirmState.item?.activa
        ? "La sucursal quedará inactiva para nuevas operaciones."
        : "La sucursal volverá a estar disponible para operar.",
      confirmText: confirmState.item?.activa ? "Desactivar" : "Activar",
      danger: confirmState.item?.activa,
    },
    delete: {
      title: `¿Seguro que deseas eliminar ${confirmState.item?.nombre}?`,
      description:
        "Se realizará baja lógica (soft delete). Podrás restaurarla más adelante.",
      confirmText: "Eliminar",
      danger: true,
    },
  };

  const currentConfirm = confirmState.type
    ? confirmConfig[confirmState.type]
    : null;

  return (
    <div>
      <PageHeader
        title="Sucursales"
        description="Panel de Gestión de Sucursales"
        breadcrumbs={[
          { label: "Gestión de Personas" },
          { label: "Sucursales" },
        ]}
        actions={
          <Can permission="sucursales.crear">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={form.modal.openCreate}
            >
              Nueva Sucursal
            </Button>
          </Can>
        }
      />

      <SucursalFiltersBar
        filters={sucursales.table.state.filters}
        search={sucursales.table.state.search}
        onSearch={(value) => sucursales.table.setSearch(value.trimStart())}
        onFilter={sucursales.table.setFilters}
        onReset={sucursales.table.reset}
      />

      <DataTable<SucursalListItem>
        data={sucursales.data}
        columns={columns}
        rowKey="id"
        scrollX={1200}
        loading={sucursales.loading}
        pagination={{
          current: sucursales.table.state.page,
          pageSize: sucursales.table.state.pageSize,
          total: sucursales.total,
          onChange: sucursales.table.setPage,
        }}
        onSortChange={sucursales.table.setSort}
      />

      <SucursalFormModal
        open={form.modal.isOpen}
        selectedItem={form.modal.selectedItem}
        isEditMode={form.modal.isEditMode}
        isSubmitting={form.modal.isSubmitting}
        onSubmit={form.handleSubmit}
        onCancel={form.modal.close}
      />

      {currentConfirm && (
        <ConfirmModal
          open={confirmState.open}
          title={currentConfirm.title}
          description={currentConfirm.description}
          confirmText={currentConfirm.confirmText}
          danger={currentConfirm.danger}
          loading={confirmState.loading}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default SucursalesPage;
