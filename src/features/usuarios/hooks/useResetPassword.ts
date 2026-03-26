// src/features/usuarios/hooks/useResetPassword.ts
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { usuariosService } from "../services/usuarios.service";
import {
  validatePassword,
  generateTemporaryPassword,
} from "../utils/password.validator";

interface ResetPasswordPayload {
  usuario_id: number;
  new_password: string;
  password_confirmation: string;
  motivo?: string;
}

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );

  /**
   * resetPassword — Realiza el reset de contraseña
   * Puede ser:
   * 1. Admin reseteando la contraseña de otro usuario (genera temporal)
   * 2. Usuario cambiando su propia contraseña (valida seguridad)
   */
  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    setLoading(true);
    try {
      // Validar contraseña
      const validation = validatePassword(payload.new_password);
      if (!validation.valid) {
        toast.error(`Contraseña débil:\n• ${validation.errors.join("\n• ")}`);
        return {
          success: false,
          errors: validation.errors,
          temporaryPassword: null,
        };
      }

      // Validar confirmación
      if (payload.new_password !== payload.password_confirmation) {
        toast.error("Las contraseñas no coinciden");
        return {
          success: false,
          errors: ["Las contraseñas no coinciden"],
          temporaryPassword: null,
        };
      }

      // Llamar al servicio
      await usuariosService.resetPassword(payload.usuario_id, {
        new_password: payload.new_password,
        password_confirmation: payload.password_confirmation,
        motivo: payload.motivo,
      });

      toast.success("Contraseña reseteada correctamente");
      setTemporaryPassword(null);

      return {
        success: true,
        errors: [],
        temporaryPassword: null,
      };
    } catch (error) {
      toast.error("Error al resetear la contraseña");
      return {
        success: false,
        errors: ["Error en el servidor"],
        temporaryPassword: null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * generateAndResetPassword — Admin genera una contraseña temporal
   */
  const generateAndResetPassword = useCallback(
    async (usuarioId: number, motivo?: string) => {
      setLoading(true);
      try {
        const tempPass = generateTemporaryPassword();
        setTemporaryPassword(tempPass);

        // Llamar al servicio con la contraseña temporal
        await usuariosService.resetPassword(usuarioId, {
          new_password: tempPass,
          password_confirmation: tempPass,
          motivo: motivo || "Contraseña temporal generada por administrador",
        });

        toast.success(
          "Contraseña temporal generada. Notifica al usuario con seguridad.",
        );
        return {
          success: true,
          temporaryPassword: tempPass,
        };
      } catch {
        toast.error("Error al generar contraseña temporal");
        setTemporaryPassword(null);
        return {
          success: false,
          temporaryPassword: null,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    temporaryPassword,
    resetPassword,
    generateAndResetPassword,
    clearTemporaryPassword: () => setTemporaryPassword(null),
  };
};
