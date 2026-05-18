// src/features/personas/screens/PersonasPage.tsx
import { useState } from "react";
import { Button, Avatar, Tooltip } from "antd";
import { Plus, Pencil, Trash2, RotateCcw, PowerOff, Eye } from "lucide-react";
import type { TableColumnsType } from "antd";

import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { Can } from "@/shared/components/guards/Can";

import { usePersonas } from "../hooks/usePersonas";
import { usePersonaForm } from "../hooks/usePersonaForm";
import { PersonaStatusBadge } from "../components/PersonaStatusBadge";
import { PersonaTypeSelector } from "../components/PersonaTypeSelector";
import { PersonaFormModal } from "../components/PersonaFormModal";
import { PersonaFiltersBar } from "../components/PersonaFilters";

import type { PersonaListItem, ConfirmState } from "../types/persona.types";
import {
  getPersonaInitials,
  getAvatarStyle,
  getConfirmConfig,
  getConfirmIcon,
  getDisplayName,
} from "../utils/persona.utils";

import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

const PersonasPage = () => {
  const personas = usePersonas();
  const form = usePersonaForm(personas.fetchPersonas);
  const navigate = useNavigate();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ESTADO DE CONFIRM MODAL */

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    type: null,
    item: null,
    loading: false,
  });

  const openConfirm = (type: "toggle" | "delete", item: PersonaListItem) =>
    setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item || !confirmState.type) return;
    setConfirmState((prev) => ({ ...prev, loading: true }));

    try {
      if (confirmState.type === "toggle") {
        await personas.toggleEstado(confirmState.item);
      } else {
        await personas.remove(confirmState.item.id);
      }
    } finally {
      closeConfirm();
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     COLUMNAS DE LA TABLA */

  const columns: TableColumnsType<PersonaListItem> = [
    {
      title: "Foto",
      key: "foto",
      width: 60,
      render: (_, r) => (
        <Avatar src={r.foto ?? undefined} style={getAvatarStyle(r)}>
          {getPersonaInitials(r)}
        </Avatar>
      ),
    },
    {
      title: "Nombre / Razón Social",
      key: "display_name",
      dataIndex: "display_name",
      sorter: true,
      sortOrder:
        personas.table.state.sort?.field === "display_name"
          ? personas.table.state.sort.direction === "asc"
            ? "ascend"
            : "descend"
          : null,
      render: (_, r) => (
        <div>
          <p
            className="font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {getDisplayName(r)}
          </p>
          {r.usuario_asociado && (
            <p
              className="text-xs m-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              @{r.usuario_asociado.username}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Tipo",
      key: "tipo",
      width: 130,
      render: (_, r) => (
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor:
              r.tipo_persona === "FISICA"
                ? "var(--color-alert-primary-bg)"
                : "var(--color-bg-subtle)",
            color:
              r.tipo_persona === "FISICA"
                ? "var(--color-primary-400)"
                : "var(--color-text-secondary)",
          }}
        >
          {r.tipo_texto}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      width: 130,
      render: (_, r) => <PersonaStatusBadge estado={r.estado} />,
    },
    {
      title: "Registro",
      key: "fecha",
      width: 150,
      render: (_, r) => (
        <Tooltip title={r.fecha_registro}>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.fecha_registro_humano}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 180,
      render: (_, record) => {
        const actions = [
          {
            key: "view",
            permission: "personas.ver" as const,
            label: "Ver",
            icon: <Eye size={14} />,
            onClick: () =>
              navigate(APP_ROUTES.DASHBOARD.PERSONAS.DETALLE(record.id)),
          },
          {
            key: "edit",
            permission: "personas.editar" as const,
            label: "Editar",
            icon: <Pencil size={14} />,
            onClick: () => form.handleEdit(record),
          },
          {
            key: "toggle",
            permission: "personas.editar" as const,
            label: record.estado === "ACTIVO" ? "Desactivar" : "Activar",
            icon:
              record.estado === "ACTIVO" ? (
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
            permission: "personas.eliminar" as const,
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

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CONFIG DEL CONFIRM MODAL */

  const currentConfirm =
    confirmState.type && confirmState.item
      ? getConfirmConfig(
          confirmState.type,
          confirmState.item.estado,
          getDisplayName(confirmState.item),
        )
      : null;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     RENDER */

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Personas"
        description="Panel de Gestión de Personas"
        breadcrumbs={[{ label: "Gestión de Personas" }, { label: "Personas" }]}
        actions={
          <Can permission="personas.crear">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={form.openTypeSelector}
            >
              Nueva Persona
            </Button>
          </Can>
        }
      />

      {/* Filtros */}
      <PersonaFiltersBar
        filters={personas.table.state.filters}
        search={personas.table.state.search}
        onSearch={(value) => personas.table.setSearch(value.trimStart())}
        onFilter={personas.table.setFilters}
        onReset={personas.table.reset}
      />

      {/* Tabla */}
      <DataTable<PersonaListItem>
        data={personas.data}
        columns={columns}
        rowKey="id"
        loading={personas.loading}
        pagination={{
          current: personas.table.state.page,
          pageSize: personas.table.state.pageSize,
          total: personas.total,
          onChange: personas.table.setPage,
        }}
        onSortChange={personas.table.setSort}
      />

      {/* Modal selector de tipo */}
      <PersonaTypeSelector
        open={form.typeSelectorOpen}
        onSelect={form.handleTipoSelected}
        onCancel={() => form.setTypeSelectorOpen(false)}
      />

      {/* Modal formulario */}
      <PersonaFormModal
        open={form.modal.isOpen}
        tipo={form.tipoSeleccionado}
        selectedItem={form.modal.selectedItem}
        isEditMode={form.modal.isEditMode}
        isSubmitting={form.modal.isSubmitting}
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
          icon={getConfirmIcon(currentConfirm.iconType)}
        />
      )}
    </div>
  );
};

export default PersonasPage;
