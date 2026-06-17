// src/shared/hooks/useAuth.ts
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useShallow } from "zustand/react/shallow";

const EMPTY_SUCURSALES = [] as const;

/**
 * useAuth — Selector del store de autenticación.
 * Expone identidad, permisos y sucursales del usuario conectado.
 */
export const useAuth = () => {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      accessToken: state.accessToken,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      hasPermission: state.hasPermission,
      hasRole: state.hasRole,
      hasAnyPermission: state.hasAnyPermission,
      sucursalActiva: state.user?.sucursalActiva ?? null,
      sucursales: state.user?.sucursales ?? EMPTY_SUCURSALES,
    })),
  );
};
