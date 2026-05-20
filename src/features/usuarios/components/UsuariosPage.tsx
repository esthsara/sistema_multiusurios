// src/features/usuarios/screens/UsuariosPage.tsx
import { useState } from "react";
import { Button, Avatar, Tooltip } from "antd";
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  PowerOff,
  Eye,
} from "lucide-react";
import type { TableColumnsType } from "antd";

import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { Can } from "@/shared/components/guards/Can";

import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { toast } from "react-toastify";

import { useUsuarios } from "../hooks/useUsuarios";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { useRolesOptions } from "../hooks/useRolesOptions";
import { useResetPassword } from "../hooks/useResetPassword";
import { useSucursalesOptions } from "../hooks/useSucursalesOptions";
import { UsuarioStatusBadge } from "../components/UsuarioStatusBadge";
import { UsuarioFormModal } from "../components/UsuarioFormModal";
import { UsuarioFiltersBar } from "../components/UsuarioFilters";

import type { UsuarioListItem, ConfirmState } from "../types/usuario.types";
import {
  getUsuarioDisplayName,
  getUsuarioInitials,
  getAvatarStyle,
  getConfirmConfig,
} from "../utils/usuario.utils";

const UsuariosPage = () => {
  const navigate = useNavigate();

  const usuarios = useUsuarios();
  const form = useUsuarioForm(usuarios.fetchUsuarios);
  const { roleOptions } = useRolesOptions();
  const resetPassword = useResetPassword();
  const { branchOptions } = useSucursalesOptions();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ESTADO DE CONFIRM MODAL */

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    type: null,
    item: null,
    loading: false,
  });

  const openConfirm = (
    type: "toggle" | "delete" | "reset-password",
    item: UsuarioListItem,
  ) => setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item || !confirmState.type) return;
    setConfirmState((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmState.type === "toggle") {
        await usuarios.toggleEstado(confirmState.item);
      } else if (confirmState.type === "delete") {
        await usuarios.remove(confirmState.item.id);
      } else if (confirmState.type === "reset-password") {
        const result = await resetPassword.generateAndResetPassword(
          confirmState.item.id,
          "Reset de contraseña desde panel de administración",
        );
        if (result.success && result.temporaryPassword) {
          await navigator.clipboard.writeText(result.temporaryPassword);
          toast.info(
            `Contraseña temporal copiada al portapapeles: ${result.temporaryPassword}`,
          );
        }
      }
    } finally {
      closeConfirm();
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     COLUMNAS DE LA TABLA */

  const columns: TableColumnsType<UsuarioListItem> = [
    {
      title: "Foto",
      key: "foto",
      width: 84,
      render: (_, r) => (
        <Avatar src={r.persona.foto ?? undefined} style={getAvatarStyle(r)}>
          {getUsuarioInitials(r)}
        </Avatar>
      ),
    },
    {
      title: "Nombre / Razón Social",
      key: "display_name",
      dataIndex: "display_name",
      width: 410,
      sorter: true,
      sortOrder:
        usuarios.table.state.sort?.field === "persona.nombre"
          ? usuarios.table.state.sort.direction === "asc"
            ? "ascend"
            : "descend"
          : null,
      render: (_, r) => (
        <div>
          <p
            className="font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {getUsuarioDisplayName(r)}
          </p>
          <p
            className="text-xs m-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            @{r.username}
          </p>
        </div>
      ),
    },
    {
      title: "Sucursales",
      key: "sucursales",
      width: 130,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.sucursales_count}{" "}
          {r.sucursales_count === 1 ? "sucursal" : "sucursales"}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      width: 120,
      render: (_, r) => <UsuarioStatusBadge activo={r.activo} />,
    },
    {
      title: "Registro",
      key: "fecha",
      width: 170,
      render: (_, r) => (
        <Tooltip title={r.created_at}>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.created_at_humano}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 140,
      render: (_, record) => {
        const actions = [
          ...(record.activo
            ? [
              {
                key: "view",
                permission: "usuarios.ver" as const,
                label: "Ver",
                icon: <Eye size={14} />,
                onClick: () =>
                  navigate(APP_ROUTES.DASHBOARD.USUARIOS.DETALLE(record.id)),
              },
              {
                key: "edit",
                permission: "usuarios.editar" as const,
                label: "Editar",
                icon: <Pencil size={14} />,
                onClick: () => form.handleEdit(record),
              },
            ]
            : []),
          {
            key: "toggle",
            permission: "usuarios.editar" as const,
            label: record.activo ? "Desactivar" : "Activar",
            icon: record.activo ? (
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
          ...(record.activo
            ? [
              {
                key: "delete",
                permission: "usuarios.eliminar" as const,
                label: "Eliminar",
                icon: <Trash2 size={14} />,
                danger: true,
                onClick: () => openConfirm("delete", record),
              },
            ]
            : []),
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
        title="Usuarios"
        description="Panel de Gestión de Usuarios"
        breadcrumbs={[{ label: "Gestión de Personas" }, { label: "Usuarios" }]}
        actions={
          <Can permission="usuarios.crear">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={form.modal.openCreate}
            >
              Nuevo Usuario
            </Button>
          </Can>
        }
      />

      <UsuarioFiltersBar
        filters={usuarios.table.state.filters}
        search={usuarios.table.state.search}
        roleOptions={roleOptions}
        branchOptions={branchOptions}
        onSearch={(value) => usuarios.table.setSearch(value.trimStart())}
        onFilter={usuarios.table.setFilters}
        onReset={usuarios.table.reset}
      />

      <DataTable<UsuarioListItem>
        data={usuarios.data}
        columns={columns}
        rowKey="id"
        scrollX={1054}
        loading={usuarios.loading}
        pagination={{
          current: usuarios.table.state.page,
          pageSize: usuarios.table.state.pageSize,
          total: usuarios.total,
          onChange: usuarios.table.setPage,
        }}
        onSortChange={usuarios.table.setSort}
      />

      <UsuarioFormModal
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

export default UsuariosPage;
