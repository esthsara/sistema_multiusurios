// src/features/personas/components/detalle/PersonaDetallePage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Skeleton } from "antd";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { Can } from "@/shared/components/guards/Can";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { personasService } from "../../services/personas.service";
import { usePersonaDetalle } from "../../hooks/usePersonaDetalle";
import { PersonaFormModal } from "../PersonaFormModal";
import { PersonaInfoGeneral } from "./PersonaInfoGeneral";
import { PersonaContactos } from "./PersonaContactos";
import { PersonaDomicilios } from "./PersonaDomicilios";
import { PersonaArchivos } from "./PersonaArchivos";
import { PersonaAuditoria } from "./PersonaAuditoria";
import type { UpdatePersonaDto } from "../../types/persona.types";

const PersonaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const personaId = Number(id);

  const { persona, loading, refetch } = usePersonaDetalle(personaId);
  const [editOpen, setEditOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const normalizeText = (value: unknown) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const handleEditSubmit = async (values: UpdatePersonaDto) => {
    if (!persona) return;

    setIsSubmittingEdit(true);
    try {
      const payload: UpdatePersonaDto =
        persona.tipo_persona === "FISICA"
          ? {
              nombre: normalizeText(values.nombre),
              apellido: normalizeText(values.apellido),
              identificacion_principal: normalizeText(
                values.identificacion_principal,
              ),
              fecha_nacimiento: normalizeText(values.fecha_nacimiento),
              genero: values.genero,
            }
          : {
              razon_social: normalizeText(values.razon_social),
              identificacion_principal: normalizeText(
                values.identificacion_principal,
              ),
            };

      await personasService.update(persona.id, payload);
      toast.success("Perfil actualizado correctamente");
      setEditOpen(false);
      refetch();
    } catch {
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const nombreDisplay = persona
    ? persona.tipo_persona === "FISICA"
      ? `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim()
      : (persona.razon_social ?? "Sin nombre")
    : "...";

  const tabs = [
    {
      key: "info",
      label: "Información General",
      children: persona ? (
        <PersonaInfoGeneral persona={persona} />
      ) : (
        <Skeleton active />
      ),
    },
    {
      key: "contactos",
      label: "Contactos",
      children: <PersonaContactos personaId={personaId} />,
    },
    {
      key: "domicilios",
      label: "Domicilios",
      children: <PersonaDomicilios personaId={personaId} />,
    },
    {
      key: "archivos",
      label: "Archivos",
      children: <PersonaArchivos personaId={personaId} />,
    },
    {
      key: "auditoria",
      label: "Auditoría",
      children: <PersonaAuditoria personaId={personaId} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={loading ? "Cargando..." : nombreDisplay}
        description={
          persona ? `ID: #${persona.id} · ${persona.tipo_texto}` : undefined
        }
        breadcrumbs={[
          { label: "Gestión de Personas" },
          { label: "Personas", path: APP_ROUTES.DASHBOARD.PERSONAS.ROOT },
          { label: nombreDisplay },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              icon={<ArrowLeft size={15} />}
              onClick={() => navigate(APP_ROUTES.DASHBOARD.PERSONAS.ROOT)}
            >
              Volver
            </Button>
            <Can permission="personas.editar">
              <Button
                type="primary"
                icon={<Pencil size={15} />}
                onClick={() => setEditOpen(true)}
              >
                Editar Perfil
              </Button>
            </Can>
          </div>
        }
      />

      {persona && (
        <div className="mb-4 flex gap-2">
          <AppTag tone={persona.estado === "ACTIVO" ? "success" : "danger"}>
            {persona.estado_texto ?? persona.estado}
          </AppTag>
          <AppTag
            tone={persona.tipo_persona === "FISICA" ? "primary" : "purple"}
          >
            {persona.tipo_texto}
          </AppTag>
        </div>
      )}

      <Tabs
        items={tabs}
        defaultActiveKey="info"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
          padding: "0 16px 16px",
          border: "1px solid var(--color-border)",
        }}
      />

      {persona && (
        <PersonaFormModal
          open={editOpen}
          tipo={persona.tipo_persona}
          selectedItem={persona}
          isEditMode
          isSubmitting={isSubmittingEdit}
          onSubmit={(values) => handleEditSubmit(values as UpdatePersonaDto)}
          onCancel={() => setEditOpen(false)}
        />
      )}
    </div>
  );
};

export default PersonaDetallePage;
