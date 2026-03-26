// src/features/personas/hooks/useContactos.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { contactosService } from "../services/contactos.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  Contacto,
  CreateContactoDto,
  UpdateContactoDto,
} from "../types/persona-detalle.types";

export const useContactos = (personaId: number) => {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(false);
  const modal = useFormModal<Contacto>();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactosService.getByPersona(personaId);
      setContactos(res.data.items);
    } catch {
      toast.error("Error al cargar contactos");
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSubmit = async (values: UpdateContactoDto) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        await contactosService.update(modal.selectedItem.id, values);
        toast.success("Contacto actualizado");
      } else {
        const dto: CreateContactoDto = { ...values, persona_id: personaId };
        await contactosService.create(dto);
        toast.success("Contacto creado");
      }
      modal.close();
      fetch();
    } catch {
      toast.error(
        modal.isEditMode
          ? "Error al actualizar contacto"
          : "Error al crear contacto",
      );
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await contactosService.remove(id);
      toast.success("Contacto eliminado");
      fetch();
    } catch {
      toast.error("Error al eliminar contacto");
    }
  };

  return { contactos, loading, modal, handleSubmit, handleDelete };
};
