// src/features/usuarios/hooks/useSucursalesOptions.ts
import { useMemo } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

interface SucursalOption {
  label: string;
  value: number;
}

/**
 * Hook para derivar sucursales asignadas al usuario actual
 * desde el estado global de auth.
 */
export const useSucursalesOptions = () => {
  const { sucursales } = useAuth();

  const branchOptions: SucursalOption[] = useMemo(
    () =>
      sucursales.map((sucursal) => ({
        label: sucursal.nombre,
        value: sucursal.id,
      })),
    [sucursales],
  );

  return {
    branchOptions,
    sucursales,
    loading: false,
    refetch: async () => undefined,
  };
};
