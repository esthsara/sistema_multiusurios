// src/features/auth/hooks/useAuthActions.ts
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { safeText } from "@/shared/utils/sanitize";
import type { LoginDto, RegisterDto } from "@/shared/types/auth.types";
import type { ApiError } from "@/shared/types/api.types";

/* useAuthActions — Orquesta acciones de auth con navegación y toasts.*/
export const useAuthActions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginAction = useAuthStore((state) => state.login);
  const registerAction = useAuthStore((state) => state.register);
  const logoutAction = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const getRedirectAfterLogin = () => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? APP_ROUTES.DASHBOARD.HOME;
  };

  const login = async (dto: LoginDto) => {
    try {
      await loginAction(dto);
      const user = useAuthStore.getState().user;
      const displayName = safeText(user?.persona.nombreCompleto, "Usuario", 80);
      toast.success(`Bienvenido, ${displayName}`);
      navigate(getRedirectAfterLogin(), { replace: true });
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors) {
        const first = Object.values(apiError.errors)[0]?.[0];
        toast.error(safeText(first, "Usuario o contraseña incorrectos", 200));
      } else {
        toast.error(safeText(apiError.message, "Error al iniciar sesión", 200));
      }
    }
  };

  const register = async (dto: RegisterDto) => {
    try {
      await registerAction(dto);
      toast.success("Cuenta creada exitosamente");
      navigate(APP_ROUTES.DASHBOARD.HOME);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        Object.values(apiError.errors)
          .flat()
          .forEach((msg) =>
            toast.error(safeText(msg, "Error de validación", 200)),
          );
      } else {
        toast.error(safeText(apiError.message, "Error al registrar", 200));
      }
    }
  };

  const logout = async () => {
    await logoutAction();
    toast.info("Sesión cerrada");
    navigate(APP_ROUTES.LOGIN, { replace: true });
  };

  return {
    login,
    register,
    logout,
    isLoading,
  };
};
