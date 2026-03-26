import { useState } from "react";
import { toast } from "react-toastify";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { usuariosService } from "../services/usuarios.service";
import type {
  UsuarioListItem,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from "../types/usuario.types";

export const useUsuarioForm = (onSuccess: () => void) => {
  const modal = useFormModal<UsuarioListItem>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        /* Editar usuario */
        const dto: UpdateUsuarioDto = {
          email: formData.email,
          username: formData.username,
          activo: formData.activo,
        };
        await usuariosService.update(modal.selectedItem.id, dto);
        toast.success("Usuario actualizado correctamente");
      } else {
        /* Crear usuario */
        const dto: CreateUsuarioDto = {
          persona_id: formData.persona_id,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          activo: formData.activo ?? true,
        };
        await usuariosService.create(dto);
        toast.success("Usuario creado correctamente");
      }
      modal.close();
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Error al guardar usuario";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (usuario: UsuarioListItem) => {
    modal.openEdit(usuario);
  };

  return {
    modal,
    isSubmitting,
    handleSubmit,
    handleEdit,
  };
};
