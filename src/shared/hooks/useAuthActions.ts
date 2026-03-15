// src/features/auth/hooks/useAuthActions.ts
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { LoginDto, RegisterDto } from "@/shared/types/auth.types";

/**
 * useAuthActions — Orquesta acciones de auth con navegación y toasts.
 * useAuth  → leer estado (componentes que solo muestran datos)
 * useAuthActions → mutaciones (formularios, botones de logout)
 */
export const useAuthActions = () => {
  const navigate = useNavigate();
  const store = useAuthStore();

  const login = async (dto: LoginDto) => {
    try {
      await store.login(dto);
      const user = useAuthStore.getState().user;
      toast.success(`Bienvenido, ${user?.persona.nombreCompleto ?? ""}`);
      navigate(APP_ROUTES.DASHBOARD.HOME);
    } catch (error) {
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
    }
  };

  const register = async (dto: RegisterDto) => {
    try {
      await store.register(dto);
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
    }
  };

  const logout = async () => {
    await store.logout();
    toast.info("Sesión cerrada correctamente");
    navigate(APP_ROUTES.LOGIN);
  };

  return {
    login,
    register,
    logout,
    isLoading: store.isLoading,
  };
};
