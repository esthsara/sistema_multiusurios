// src/features/personas/components/PersonasPage.tsx
import { useState } from "react";
import { Button, Avatar, Tooltip } from "antd";
import { Plus, Pencil, Trash2, RotateCcw, PowerOff, Eye } from "lucide-react";
import type { TableColumnsType } from "antd";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { Can } from "@/shared/components/atoms/Can";
import { usePersonas } from "../hooks/usePersonas";
import { usePersonaForm } from "../hooks/usePersonaForm";
import { PersonaStatusBadge } from "./PersonaStatusBadge";
import { PersonaTypeSelector } from "./PersonaTypeSelector";
import { PersonaFormModal } from "./PersonaFormModal";
import { PersonaFiltersBar } from "./PersonaFilters";
import type { PersonaListItem } from "../types/persona.types";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

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

  /*navegar al ver */
  const navigate = useNavigate();

  const getPersonaInitials = (persona: PersonaListItem) => {
    if (persona.tipo_persona === "FISICA") {
      const nombre = (persona.nombre ?? "").trim();
      const apellido = (persona.apellido ?? "").trim();

      if (nombre && apellido) {
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
      }

      if (nombre) {
        const initials = nombre
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join("");
        return initials || "P";
      }

      return "P";
    }

    const source = (persona.razon_social ?? persona.display_name ?? "").trim();
    const initials = source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return initials || "M";
  };

  const getAvatarStyle = (persona: PersonaListItem) => {
    if (persona.foto) {
      return { backgroundColor: "var(--color-bg-overlay)" };
    }

    if (persona.tipo_persona === "FISICA") {
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
                : "rgba(38, 39, 58, 0.1)",
            color: r.tipo_persona === "FISICA" ? "#a8a9e9" : "#6366f1",
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
        />
      )}
    </div>
  );
};

export default PersonasPage;
