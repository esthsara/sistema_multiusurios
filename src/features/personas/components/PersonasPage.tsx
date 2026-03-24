// src/features/personas/components/PersonasPage.tsx
import { useState } from "react";
import { Button, Avatar, Tooltip } from "antd";
import { Plus, Pencil, Trash2, RotateCcw, PowerOff } from "lucide-react";
import type { TableColumnsType } from "antd";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { usePersonas } from "../hooks/usePersonas";
import { usePersonaForm } from "../hooks/usePersonaForm";
import { PersonaStatusBadge } from "./PersonaStatusBadge";
import { PersonaTypeSelector } from "./PersonaTypeSelector";
import { PersonaFormModal } from "./PersonaFormModal";
import { PersonaFiltersBar } from "./PersonaFilters";
import type { PersonaListItem } from "../types/persona.types";

const PersonasPage = () => {
  const personas = usePersonas();
  const form = usePersonaForm(personas.fetchPersonas);
  

  /* Estado para modales de confirmación */
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: "toggle" | "delete" | null;
    item: PersonaListItem | null;
    loading: boolean;
  }>({ open: false, type: null, item: null, loading: false });

  const openConfirm = (type: "toggle" | "delete", item: PersonaListItem) =>
    setConfirmState({ open: true, type, item, loading: false });

  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, item: null, loading: false });

  const handleConfirm = async () => {
    if (!confirmState.item) return;
    setConfirmState((prev) => ({ ...prev, loading: true }));

    if (confirmState.type === "toggle") {
      await personas.toggleEstado(confirmState.item);
    } else if (confirmState.type === "delete") {
      await personas.remove(confirmState.item.id);
    }
    closeConfirm();
  };

  /* ── Columnas de la tabla ── */
  const columns: TableColumnsType<PersonaListItem> = [
    {
      title: "Foto",
      key: "foto",
      width: 60,
      render: (_, r) => (
        <Avatar
          src={r.foto}
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          {r.display_name?.charAt(0).toUpperCase() ?? "P"}
        </Avatar>
      ),
    },
    {
      title: "Nombre / Razón Social",
      key: "nombre",
      sorter: true,
      render: (_, r) => (
        <div>
          <p
            className="font-medium m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {(r.razon_social ??
              `${r.nombre ?? ""} ${r.apellido ?? ""}`.trim()) ||
              "Sin nombre"}
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
      title: "Identificador",
      dataIndex: "identificacion_principal",
      key: "identificacion",
      width: 150,
    },
    {
      title: "Tipo",
      key: "tipo",
      width: 100,
      render: (_, r) => (
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor:
              r.tipo_persona === "FISICA"
                ? "rgba(59,130,246,0.1)"
                : "rgba(99,102,241,0.1)",
            color:
              r.tipo_persona === "FISICA"
                ? "#6366f1"
                : "#6366f1",
          }}
        >
          {r.tipo_texto}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      width: 100,
      render: (_, r) => <PersonaStatusBadge estado={r.estado} />,
    },
    {
      title: "Registro",
      key: "fecha",
      width: 130,
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
      width: 130,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Can permission="personas.editar">
            <Tooltip title="Editar">
              <Button
                type="text"
                size="small"
                icon={<Pencil size={14} />}
                onClick={() => form.handleEdit(record)}
              />
            </Tooltip>
          </Can>

          <Can permission="personas.editar">
            <Tooltip
              title={record.estado === "ACTIVO" ? "Desactivar" : "Activar"}
            >
              <Button
                type="text"
                size="small"
                icon={
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
                  )
                }
                onClick={() => openConfirm("toggle", record)}
              />
            </Tooltip>
          </Can>

          <Can permission="personas.eliminar">
            <Tooltip title="Eliminar">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={14} />}
                onClick={() => openConfirm("delete", record)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ];

  /* ── Textos del ConfirmModal ── */
  const confirmConfig = {
    toggle: {
      title:
        confirmState.item?.estado === "ACTIVO"
          ? "¿Deseas desactivar esta persona?"
          : "¿Deseas activar esta persona nuevamente?",
      description:
        confirmState.item?.estado === "ACTIVO"
          ? "El usuario no podrá iniciar sesión ni acceder a nuevas funcionalidades."
          : "La persona podrá iniciar sesión y utilizar las funcionalidades disponibles.",
      confirmText:
        confirmState.item?.estado === "ACTIVO" ? "Desactivar" : "Activar",
      danger: confirmState.item?.estado === "ACTIVO",
    },
    delete: {
      title: `¿Seguro que deseas eliminar a ${confirmState.item?.display_name}?`,
      description:
        "Esta acción puede revertirse restaurando la persona más adelante.",
      confirmText: "Eliminar",
      danger: true,
    },
  };

  const currentConfirm = confirmState.type
    ? confirmConfig[confirmState.type]
    : null;

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
        onSearch={personas.table.setSearch}
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
        />
      )}
    </div>
  );
};

export default PersonasPage;
