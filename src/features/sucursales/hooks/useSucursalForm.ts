// src/features/sucursales/hooks/useSucursalForm.ts
import { toast } from "react-toastify";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import type {
  SucursalListItem,
  SucursalDetalle,
  CreateSucursalDto,
  UpdateSucursalDto,
} from "@/features/sucursales/types/sucursal.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NORMALIZACIÓN */

const hydrateListItemFromDetail = (
  detail: SucursalDetalle,
): SucursalListItem => {
  return {
    id: detail.id,
    nombre: detail.nombre,
    codigo: detail.codigo,
    activa: detail.activa,
    email: detail.email,
    direccion: detail.direccion,
    descripcion: detail.descripcion,
    horario: detail.horario_completo,
    horario_apertura: detail.horario_apertura,
    horario_cierre: detail.horario_cierre,
    logo: detail.logo,
    usuarios_count: detail.usuarios_count,
    created_at: detail.created_at,
    updated_at: detail.updated_at,
  };
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOOK */

export const useSucursalForm = (onSuccess: () => void) => {
  const modal = useFormModal<SucursalListItem>();

  const handleEdit = async (sucursal: SucursalListItem) => {
    modal.setIsSubmitting(true);
    try {
      const response = await sucursalesService.getById(sucursal.id);
      const hydratedItem = hydrateListItemFromDetail(response.data);
      modal.openEdit(hydratedItem);
    } catch {
      toast.error("No se pudieron cargar los datos de la sucursal");
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  const handleSubmit = async (
    values: CreateSucursalDto | UpdateSucursalDto,
  ) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        const payload: UpdateSucursalDto = {
          codigo: values.codigo ?? modal.selectedItem.codigo,
          nombre: values.nombre,
          email: values.email,
          direccion: values.direccion,
          descripcion: values.descripcion,
          horario_apertura: values.horario_apertura,
          horario_cierre: values.horario_cierre,
          activa: values.activa,
          ...(values.logo ? { logo: values.logo } : {}),
        };

        await sucursalesService.update(modal.selectedItem.id, payload);
        toast.success("Sucursal actualizada correctamente");
      } else {
        await sucursalesService.create(values as CreateSucursalDto);
        toast.success("Sucursal creada correctamente");
      }
      modal.close();
      onSuccess();
    } catch {
      toast.error(
        modal.isEditMode
          ? "Error al actualizar sucursal"
          : "Error al crear sucursal",
      );
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  return { modal, handleSubmit, handleEdit };
};
