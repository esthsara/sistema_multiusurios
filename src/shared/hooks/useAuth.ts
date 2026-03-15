// src/shared/hooks/useAuth.ts  — ahora es un selector del store
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useShallow } from "zustand/react/shallow";

const EMPTY_SUCURSALES = [] as const;

/**

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
