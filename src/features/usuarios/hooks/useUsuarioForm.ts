// src/features/usuarios/hooks/useUsuarioForm.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { usuariosService } from "../services/usuarios.service";
import type {
  UsuarioListItem,
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from "../types/usuario.types";

/**
 * FormValues — tipo del 
 */
interface FormValues {
  persona_id?: number;
  email: string;
  username: string;
  password?: string;
  password_confirmation?: string;
  activo?: boolean;
}

export const useUsuarioForm = (onSuccess: () => void) => {
  const modal = useFormModal<UsuarioListItem>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (usuario: UsuarioListItem) => {
    modal.openEdit(usuario);
  };

  const handleSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    try {
      if (modal.isEditMode && modal.selectedItem) {
        const dto: UpdateUsuarioDto = {
          email: formData.email,
          username: formData.username,
          activo: formData.activo,
          ...(formData.password && {
            password: formData.password,
            password_confirmation: formData.password_confirmation,
          }),
        };
        await usuariosService.update(modal.selectedItem.id, dto);
        toast.success("Usuario actualizado correctamente");
      } else {
        /**
         * En modo crear, persona_id es requerido.
         * El formulario debe garantizarlo antes de llamar handleSubmit.
         */
        const dto: CreateUsuarioDto = {
          persona_id: formData.persona_id!,
          email: formData.email,
          username: formData.username,
          password: formData.password!,
          password_confirmation: formData.password_confirmation!,
          activo: formData.activo ?? true,
        };
        await usuariosService.create(dto);
        toast.success("Usuario creado correctamente");
      }
      modal.close();
      onSuccess();
    } catch (error) {
      const apiError = error as { message?: string };
      toast.error(apiError.message ?? "Error al guardar usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    modal,
    isSubmitting,
    handleSubmit,
    handleEdit,
  };
};
