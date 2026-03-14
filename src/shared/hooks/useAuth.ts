// src/shared/hooks/useAuth.ts
import { useState } from "react";
import type {
  AuthState,
  AuthUser,
  PermissionString,
  RoleName,
} from "@/shared/types/auth.types";

/**
 * Mock temporal — En Paso 6 conectamos con JWT real.
 * ¿Por qué mock aquí? Nos permite construir toda la navegación
 * y protección de rutas sin depender de la API todavía.
 */
const MOCK_USER: AuthUser = {
  id: 1,
  email: "admin@sistema.com",
  persona: { id: 1, tipo: "fisica", nombre: "Administrador del Sistema" },
  roles: [{ id: 1, name: "admin", permissions: [] }],
  permissions: [
    "personas.ver",
    "personas.crear",
    "personas.editar",
    "personas.eliminar",
    "sucursales.ver",
    "usuarios.ver",
    "roles.ver",
    "auditoria.ver",
  ],
  sucursales: [{ id: 1, nombre: "Matriz", clave: "MTZ" }],
  sucursalActiva: { id: 1, nombre: "Matriz", clave: "MTZ" },
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: MOCK_USER, // Cambia a null para simular logout
    accessToken: "mock-token",
    isAuthenticated: true,
    isLoading: false,
  });

  /**
   * hasPermission — Verificación de permiso individual.
   *
   * ¿Por qué PermissionString y no string?
   * Si escribes hasPermission('personas-ver') TypeScript
   * te marcará error en tiempo de desarrollo, no en producción.
   */
  const hasPermission = (permission: PermissionString): boolean => {
    if (!authState.user) return false;

    const isSuper = authState.user.roles.some((r) => r.name === "super-admin");
    if (isSuper) return true;

    return authState.user.permissions.includes(permission);
  };

  /**
   * hasRole — Verificación de rol.
   * Acepta un rol o un array de roles (OR lógico).
   */
  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!authState.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return authState.user.roles.some((r) => roles.includes(r.name));
  };

  /**
   * hasAnyPermission — OR lógico entre múltiples permisos.
   * Útil para mostrar una sección si tiene AL MENOS uno.
   */
  const hasAnyPermission = (permissions: PermissionString[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const logout = () => {
    setAuthState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    hasPermission,
    hasRole,
    hasAnyPermission,
    logout,
  } as const;
};
