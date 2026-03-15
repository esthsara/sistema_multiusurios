// src/features/auth/hooks/useAuthActions.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "@/features/auth/services/auth.service";
import {
  adaptBackendUser,
  extractPlainToken,
} from "@/features/auth/adapters/auth.adapter";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type {
  LoginDto,
  RegisterDto,
  AuthUser,
} from "@/shared/types/auth.types";

/**
 * useAuthActions — Orquesta login, register y logout.
 *
 * En Paso 7 reemplazaremos el useState local
 * por el store de Zustand. La interfaz pública
 * de este hook NO cambiará — eso protege los
 * componentes que lo consuman.
 */
export const useAuthActions = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const response = await authService.login(dto);
      const { user: backendUser, access_token, session_id } = response.data;

      // Extrae el plainTextToken sin importar la estructura
      const plainToken = extractPlainToken(access_token);

      // Normaliza el usuario con el adapter
      const authUser = adaptBackendUser(backendUser, session_id);

      /**
       * Guarda el token temporalmente en sessionStorage.
       * En Paso 7 irá a memoria (Zustand).
       * El interceptor de Axios ya lo lee de sessionStorage.
       */
      sessionStorage.setItem("access_token", plainToken);

      // Llama /auth/me para obtener roles y permisos completos
      const meResponse = await authService.me();
      const fullUser = adaptBackendUser(
        { ...backendUser, ...meResponse.data },
        session_id,
      );

      setUser(fullUser);
      toast.success(`Bienvenido, ${fullUser.persona.nombreCompleto}`);
      navigate(APP_ROUTES.DASHBOARD.HOME);
    } catch (error) {
      // El error ya fue parseado en el servicio
      // Si tiene errores de validación los mostramos
      const apiError = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };
      if (apiError.errors) {
        const first = Object.values(apiError.errors)[0]?.[0];
        toast.error(first ?? "Credenciales incorrectas");
      } else {
        toast.error(apiError.message ?? "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await authService.register(dto);
      const { user: backendUser, access_token, session_id } = response.data;

      // Register devuelve string directamente
      const plainToken = extractPlainToken(access_token);
      sessionStorage.setItem("access_token", plainToken);

      const authUser = adaptBackendUser(backendUser, session_id);
      setUser(authUser);

      toast.success("Cuenta creada exitosamente");
      navigate(APP_ROUTES.DASHBOARD.HOME);
    } catch (error) {
      const apiError = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };
      if (apiError.errors) {
        Object.values(apiError.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(apiError.message ?? "Error al registrar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("sucursal_activa_id");
      setUser(null);
      setIsLoading(false);
      navigate(APP_ROUTES.LOGIN);
      toast.info("Sesión cerrada");
    }
  };

  return { user, isLoading, login, register, logout };
};
