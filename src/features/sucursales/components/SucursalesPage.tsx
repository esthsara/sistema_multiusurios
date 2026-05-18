// src/features/sucursales/screens/SucursalesPage.tsx
import { useState } from "react";
import { Avatar, Button } from "antd";
import { Eye, Pencil, Plus, PowerOff, RotateCcw, Trash2 } from "lucide-react";
import type { TableColumnsType } from "antd";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { Can } from "@/shared/components/guards/Can";

import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

import { useSucursales } from "../hooks/useSucursales";
import { useSucursalForm } from "../hooks/useSucursalForm";
import { SucursalFiltersBar } from "../components/SucursalFilters";
import { SucursalStatusBadge } from "../components/SucursalStatusBadge";
import { SucursalFormModal } from "../components/SucursalFormModal";

import type { SucursalListItem, ConfirmState } from "../types/sucursal.types";
import {
  getSucursalInitials,
  getConfirmConfig,
  getHorarioDisplay,
} from "../utils/sucursal.utils";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";

const SucursalesPage = () => {
  const navigate = useNavigate();
  const sucursales = useSucursales();
  const form = useSucursalForm(sucursales.fetchSucursales);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ESTADO DE CONFIRM MODAL */

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    type: null,
    item: null,
    loading: false,
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CONFIRM ACTIONS */

  const openConfirm = (type: "toggle" | "delete", item: SucursalListItem) =>
    setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item || !confirmState.type) return;

    setConfirmState((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmState.type === "toggle") {
        await sucursales.toggleEstado(confirmState.item);
      } else {
        await sucursales.remove(confirmState.item);
      }
    } finally {
      closeConfirm();
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     COLUMNAS DE LA TABLA */

  const columns: TableColumnsType<SucursalListItem> = [
    {
      title: "Logo",
      key: "logo",
      width: 90,
      render: (_, r) => (
        <Avatar
          size={42}
          src={r.logo ? getResolvedFileUrl(r.logo) : undefined}
          style={{
            backgroundColor: "var(--color-primary-100)",
            color: "var(--color-primary-700)",
            fontWeight: 700,
            border: "1px solid var(--color-border)",
          }}
        >
          {getSucursalInitials(r.nombre)}
        </Avatar>
      ),
    },
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
      ),
    },
    {
      title: "Horario",
      key: "horario",
      width: 160,
      render: (_, r) => (
        <span style={{ color: "var(--color-text-secondary)" }}>
          {getHorarioDisplay(r)}
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
      title: "Nro usuarios",
      key: "usuarios_count",
      width: 130,
      align: "center",
      render: (_, r) => (
        <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
          {r.usuarios_count ?? 0}
        </span>
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
            onClick: () =>
              navigate(APP_ROUTES.DASHBOARD.SUCURSALES.DETALLE(record.id)),
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
            label: "Enviar a papelera",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => openConfirm("delete", record),
          },
        ];

        return <RowActions actions={actions} />;
      },
    },
  ];

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CONFIG DEL CONFIRM MODAL */

  const currentConfirm = confirmState.type
    ? getConfirmConfig(confirmState.type, confirmState.item)
    : null;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     RENDER */

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
        scrollX={980}
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
          icon={currentConfirm.icon}
        />
      )}
    </div>
  );
};

export default SucursalesPage;
