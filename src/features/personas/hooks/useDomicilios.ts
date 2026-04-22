// src/features/personas/hooks/useDomicilios.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { domiciliosService } from "../services/domicilios.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  Domicilio,
  CreateDomicilioDto,
  UpdateDomicilioDto,
} from "../types/persona-detalle.types";

export const useDomicilios = (personaId: number) => {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingPrincipalId, setMarkingPrincipalId] = useState<number | null>(
    null,
  );
  const modal = useFormModal<Domicilio>();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await domiciliosService.getByPersona(personaId);
      setDomicilios(res.data.items);
    } catch {
      toast.error("Error al cargar domicilios");
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSubmit = async (
    values: CreateDomicilioDto | UpdateDomicilioDto,
  ) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        await domiciliosService.update(
          modal.selectedItem.id,
          values as UpdateDomicilioDto,
        );
        toast.success("Domicilio actualizado");
      } else {
        const dto: CreateDomicilioDto = {
          ...values,
          persona_id: personaId,
        } as CreateDomicilioDto;
        await domiciliosService.create(dto);
        toast.success("Domicilio creado");
      }
      modal.close();
      fetch();
    } catch {
      toast.error(
        modal.isEditMode
          ? "Error al actualizar domicilio"
          : "Error al crear domicilio",
      );
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await domiciliosService.remove(id);
      toast.success("Domicilio eliminado");
      fetch();
    } catch {
      toast.error("Error al eliminar domicilio");
    }
  };

  const handleMarkPrincipal = async (domicilio: Domicilio) => {
    setMarkingPrincipalId(domicilio.id);
    try {
      await domiciliosService.update(domicilio.id, {
        principal: true,
      } as UpdateDomicilioDto);
      toast.success("Domicilio marcado como principal");
      fetch();
    } catch {
      toast.error("Error al marcar domicilio como principal");
    } finally {
      setMarkingPrincipalId(null);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await domiciliosService.restore(id);
      toast.success("Domicilio restaurado");
      fetch();
    } catch {
      toast.error("Error al restaurar domicilio");
    }
  };

  return {
    domicilios,
    loading,
    modal,
    markingPrincipalId,
    handleSubmit,
    handleDelete,
    handleMarkPrincipal,
    handleRestore,
  };
};
