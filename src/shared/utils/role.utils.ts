// src/shared/utils/role.utils.ts

/**
 * isSuperAdminRole — Normaliza y verifica si un nombre de rol es "super-admin".
 * Maneja variaciones de formato: "Super Admin", " super-admin ", "SUPER ADMIN", etc.
 */
export const isSuperAdminRole = (roleName: string): boolean =>
  roleName.trim().toLowerCase().replace(/\s+/g, "-") === "super-admin";
