import { useState } from "react";
import { Button, Avatar, Tooltip } from "antd";
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  PowerOff,
  Eye,
  Key,
} from "lucide-react";
import type { TableColumnsType } from "antd";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";

import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

import { Can } from "@/shared/components/atoms/Can";
import { useUsuarios } from "../hooks/useUsuarios";
import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { useRolesOptions } from "../hooks/useRolesOptions";
import { useResetPassword } from "../hooks/useResetPassword";
import { useSucursalesOptions } from "../hooks/useSucursalesOptions";
import { UsuarioStatusBadge } from "./UsuarioStatusBadge";
import { UsuarioFormModal } from "./UsuarioFormModal";
import { UsuarioFiltersBar } from "./UsuarioFilters";
import type { UsuarioListItem } from "../types/usuario.types";
import { toast } from "react-toastify";
import {
  getUsuarioDisplayName,
  getUsuarioInitials,
} from "../utils/usuario.formatters";

const UsuariosPage = () => {
  const navigate = useNavigate();

  const usuarios = useUsuarios();
  const form = useUsuarioForm(usuarios.fetchUsuarios);
  const { roleOptions } = useRolesOptions();
  const resetPassword = useResetPassword();
  const { branchOptions } = useSucursalesOptions();

  /* Estado para modales de confirmación */
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: "toggle" | "delete" | "reset-password" | null;
    item: UsuarioListItem | null;
    loading: boolean;
  }>({ open: false, type: null, item: null, loading: false });

  const openConfirm = (
    type: "toggle" | "delete" | "reset-password",
    item: UsuarioListItem,
  ) => setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item) return;
    setConfirmState((prev) => ({ ...prev, loading: true }));

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
        // Mostrar contraseña temporal en un modal o copiar al portapapeles
        await navigator.clipboard.writeText(result.temporaryPassword);
        toast.info(
          `Contraseña temporal copiada al portapapeles: ${result.temporaryPassword}`,
        );
      }
    }

    closeConfirm();
  };

  const getAvatarStyle = (usuario: UsuarioListItem) => {
    if (usuario.persona.foto) {
      return { backgroundColor: "var(--color-bg-overlay)" };
    }

    if (usuario.persona.tipo_persona === "FISICA") {
      return {
        backgroundColor:
          "color-mix(in srgb, var(--color-primary-600) 72%, var(--color-bg-base) 28%)",
        color: "var(--color-text-inverse)",
        fontWeight: 700,
      };
    }

    return {
      backgroundColor:
        "color-mix(in srgb, var(--color-primary-400) 32%, var(--color-bg-overlay) 68%)",
      color: "var(--color-primary-700)",
      fontWeight: 700,
    };
  };

  /* ── Columnas de la tabla ── */
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
          {
            key: "reset-password",
            permission: "usuarios.editar" as const,
            label: "Resetear Contraseña",
            icon: <Key size={14} />,
            onClick: () => openConfirm("reset-password", record),
          },
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
          {
            key: "delete",
            permission: "usuarios.eliminar" as const,
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

  /* ── Textos del ConfirmModal ── */
  const confirmConfig = {
    toggle: {
      title: confirmState.item?.activo
        ? "¿Deseas desactivar este usuario?"
        : "¿Deseas activar este usuario nuevamente?",
      description: confirmState.item?.activo
        ? "El usuario no podrá iniciar sesión ni acceder a nuevas funcionalidades."
        : "El usuario podrá iniciar sesión y utilizar las funcionalidades disponibles.",
      confirmText: confirmState.item?.activo ? "Desactivar" : "Activar",
      danger: confirmState.item?.activo,
    },
    "reset-password": {
      title: `¿Resetear contraseña de ${confirmState.item?.username}?`,
      description:
        "Se generará una contraseña temporal y se copiará automáticamente al portapapeles.",
      confirmText: "Resetear",
      danger: false,
    },
    delete: {
      title: `¿Seguro que deseas eliminar a ${confirmState.item?.username}?`,
      description:
        "Se aplicará una baja lógica (soft delete). Podrás restaurar el usuario después.",
      confirmText: "Eliminar",
      danger: true,
    },
  };

  const currentConfirm = confirmState.type
    ? confirmConfig[confirmState.type as keyof typeof confirmConfig]
    : null;

  return (
    <div>
      {/* Header */}
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

      {/* Filtros */}
      <UsuarioFiltersBar
        filters={usuarios.table.state.filters}
        search={usuarios.table.state.search}
        roleOptions={roleOptions}
        branchOptions={branchOptions}
        onSearch={(value) => usuarios.table.setSearch(value.trimStart())}
        onFilter={usuarios.table.setFilters}
        onReset={usuarios.table.reset}
      />

      {/* Tabla */}
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

      {/* Modal formulario */}
      <UsuarioFormModal
        open={form.modal.isOpen}
        selectedItem={form.modal.selectedItem}
        isEditMode={form.modal.isEditMode}
        isSubmitting={form.isSubmitting}
        onSubmit={form.handleSubmit}
        onCancel={form.modal.close}
      />

      {/* Modal confirmación */}
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

export default UsuariosPage;
