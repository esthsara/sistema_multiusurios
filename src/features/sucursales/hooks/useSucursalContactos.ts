import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalContactosService } from "@/features/sucursales/services/sucursal-contactos.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  SucursalContacto,
  CreateSucursalContactoDto,
  UpdateSucursalContactoDto,
} from "@/features/sucursales/types/sucursal.types";

export const useSucursalContactos = (sucursalId: number) => {
  const [contactos, setContactos] = useState<SucursalContacto[]>([]);
  const [loading, setLoading] = useState(false);
  const modal = useFormModal<SucursalContacto>();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalContactosService.getBySucursal(sucursalId);
      setContactos(res.data.items ?? []);
    } catch {
      toast.error("Error al cargar contactos de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSubmit = async (values: UpdateSucursalContactoDto) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        await sucursalContactosService.update(modal.selectedItem.id, values);
        toast.success("Contacto actualizado");
      } else {
        const dto: CreateSucursalContactoDto = {
          tipo: values.tipo,
          valor: values.valor,
        };
        await sucursalContactosService.create(sucursalId, dto);
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
      await sucursalContactosService.remove(id);
      toast.success("Contacto eliminado");
      fetch();
    } catch {
      toast.error("Error al eliminar contacto");
    }
  };

  return { contactos, loading, modal, handleSubmit, handleDelete };
};
