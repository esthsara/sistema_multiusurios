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
      if (modal.isEditMode && modal.selectedItem) {
        await personasService.update(
          modal.selectedItem.id,
          values as UpdatePersonaDto,
        );
        toast.success("Persona actualizada correctamente");
      } else {
        await personasService.create(values as CreatePersonaDto);
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
