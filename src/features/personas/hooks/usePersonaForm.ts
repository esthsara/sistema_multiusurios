// src/features/personas/hooks/usePersonaForm.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { personasService } from "../services/personas.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  PersonaListItem,
  CreatePersonaDto,
  UpdatePersonaDto,
} from "../types/persona.types";
import type { TipoPersona } from "@/shared/types/auth.types";

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const buildPersonaPayload = (
  raw: CreatePersonaDto | UpdatePersonaDto,
  tipo: TipoPersona,
  isEditMode: boolean,
): CreatePersonaDto | UpdatePersonaDto => {
  const input = raw as UpdatePersonaDto;

  if (tipo === "FISICA") {
    const payload = {
      nombre: normalizeText(input.nombre),
      apellido: normalizeText(input.apellido),
      identificacion_principal: normalizeText(input.identificacion_principal),
      fecha_nacimiento: normalizeText(input.fecha_nacimiento),
      genero: input.genero,
    };

    return isEditMode
      ? payload
      : ({ ...payload, tipo_persona: "FISICA" } as CreatePersonaDto);
  }

  const payload = {
    razon_social: normalizeText(input.razon_social),
    identificacion_principal: normalizeText(input.identificacion_principal),
  };

  return isEditMode
    ? payload
    : ({ ...payload, tipo_persona: "MORAL" } as CreatePersonaDto);
};

export const usePersonaForm = (onSuccess: () => void) => {
  const modal = useFormModal<PersonaListItem>();

  /**
   * tipoSeleccionado — controla qué formulario mostrar.
   * Se selecciona en el TypeSelector antes de abrir el form.
   */
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPersona | null>(
    null,
  );
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  const openTypeSelector = () => setTypeSelectorOpen(true);

  const handleTipoSelected = (tipo: TipoPersona) => {
    setTipoSeleccionado(tipo);
    setTypeSelectorOpen(false);
    modal.openCreate();
  };

  const handleEdit = (persona: PersonaListItem) => {
    setTipoSeleccionado(persona.tipo_persona);
    modal.openEdit(persona);
  };

  const handleSubmit = async (values: CreatePersonaDto | UpdatePersonaDto) => {
    modal.setIsSubmitting(true);
    try {
      const tipo = tipoSeleccionado ?? modal.selectedItem?.tipo_persona;
      if (!tipo) {
        toast.error("No se pudo determinar el tipo de persona");
        return;
      }

      const payload = buildPersonaPayload(values, tipo, modal.isEditMode);

      if (modal.isEditMode && modal.selectedItem) {
        await personasService.update(
          modal.selectedItem.id,
          payload as UpdatePersonaDto,
        );
        toast.success("Persona actualizada correctamente");
      } else {
        await personasService.create(payload as CreatePersonaDto);
        toast.success("Persona creada correctamente");
      }
      modal.close();
      onSuccess();
    } catch {
      toast.error(
        modal.isEditMode
          ? "Error al actualizar persona"
          : "Error al crear persona",
      );
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  return {
    modal,
    tipoSeleccionado,
    typeSelectorOpen,
    setTypeSelectorOpen,
    openTypeSelector,
    handleTipoSelected,
    handleEdit,
    handleSubmit,
  };
};
