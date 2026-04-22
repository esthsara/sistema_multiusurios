import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalDomiciliosService } from "../services/sucursal-domicilios.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  SucursalDomicilio,
  CreateSucursalDomicilioDto,
  UpdateSucursalDomicilioDto,
} from "../types/sucursal.types";

export const useSucursalDomicilios = (sucursalId: number) => {
  const [domicilios, setDomicilios] = useState<SucursalDomicilio[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingPrincipalId, setMarkingPrincipalId] = useState<number | null>(
    null,
  );
  const modal = useFormModal<SucursalDomicilio>();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalDomiciliosService.getBySucursal(sucursalId);
      setDomicilios(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar domicilios de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSubmit = async (
    values: CreateSucursalDomicilioDto | UpdateSucursalDomicilioDto,
  ) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        await sucursalDomiciliosService.update(
          modal.selectedItem.id,
          values as UpdateSucursalDomicilioDto,
        );
        toast.success("Domicilio actualizado");
      } else {
        await sucursalDomiciliosService.create(
          sucursalId,
          values as CreateSucursalDomicilioDto,
        );
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
      await sucursalDomiciliosService.remove(id);
      toast.success("Domicilio eliminado");
      fetch();
    } catch {
      toast.error("Error al eliminar domicilio");
    }
  };

  const handleMarkPrincipal = async (domicilio: SucursalDomicilio) => {
    setMarkingPrincipalId(domicilio.id);
    try {
      await sucursalDomiciliosService.update(domicilio.id, {
        principal: true,
      });
      toast.success("Domicilio marcado como principal");
      fetch();
    } catch {
      toast.error("Error al marcar domicilio como principal");
    } finally {
      setMarkingPrincipalId(null);
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
  };
};
