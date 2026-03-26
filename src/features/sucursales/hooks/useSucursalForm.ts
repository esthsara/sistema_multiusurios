import { toast } from "react-toastify";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { sucursalesService } from "../services/sucursales.service";
import type {
  SucursalListItem,
  CreateSucursalDto,
  UpdateSucursalDto,
} from "../types/sucursal.types";

export const useSucursalForm = (onSuccess: () => void) => {
  const modal = useFormModal<SucursalListItem>();

  const handleEdit = (sucursal: SucursalListItem) => {
    modal.openEdit(sucursal);
  };

  const handleSubmit = async (
    values: CreateSucursalDto | UpdateSucursalDto,
  ) => {
    modal.setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        await sucursalesService.update(
          modal.selectedItem.id,
          values as UpdateSucursalDto,
        );
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
