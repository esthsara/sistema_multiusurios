// src/features/auth/adapters/auth.adapter.ts
import type {
  BackendUser,
  BackendPersona,
  AccessTokenObject,
  AuthUser,
  Persona,
} from "@/shared/types/auth.types";

/**
 * getNombreCompleto — Calcula el nombre según tipo_persona.
 * FISICA → "Juan Carlos Pérez Gómez"
 * MORAL  → "Empresa Boliviana SRL"
 */
const getNombreCompleto = (persona: BackendPersona): string => {
  if (persona.tipo_persona === "MORAL") {
    return persona.razon_social ?? "Sin razón social";
  }
  return (
    [persona.nombre, persona.apellido].filter(Boolean).join(" ") || "Sin nombre"
  );
};

/**
 * adaptPersona — Convierte BackendPersona a Persona 
 * snake_case → camelCase + campo calculado nombreCompleto.
 */
const adaptPersona = (persona: BackendPersona): Persona => ({
  id: persona.id,
  tipoPersona: persona.tipo_persona,
  nombre: persona.nombre,
  apellido: persona.apellido,
  razonSocial: persona.razon_social,
  identificacionPrincipal: persona.identificacion_principal,
  fechaNacimiento: persona.fecha_nacimiento,
  genero: persona.genero,
  fotoPatch: persona.foto_path,
  estado: persona.estado,
  nombreCompleto: getNombreCompleto(persona),
});

/**
 * extractPlainToken — Resuelve la inconsistencia del access_token.
 *
 * Register → string directo
 * Login    → objeto con plainTextToken 
 * esto es del backend no lo invente
 *
 * Union Type: string | AccessTokenObject
 * TypeScript nos obliga a manejar ambos casos.
 */
export const extractPlainToken = (
  token: string | AccessTokenObject,
): string => {
  if (typeof token === "string") return token;
  return token.plainTextToken;
};

/**
 * adaptBackendUser — Convierte BackendUser en AuthUser normalizado.
 * Es el corazón del adapter: un solo punto de transformación.
 */
export const adaptBackendUser = (
  user: BackendUser,
  sessionId: number | null = null,
): AuthUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  activo: user.activo,
  persona: adaptPersona(user.persona),

  roles: (user.roles ?? []).map((role) => ({
    id: role.id,
    name: role.name,
    permisos: role.permissions ?? [],
  })),

  /**
   * 'permisos' — viene del /auth/me directamente.
   * En login/register puede venir vacío y se llena con /auth/me.
   */
  permisos: user.permisos ?? [],

  sucursales: user.sucursales ?? [],

  /**
   * sucursalActiva — normalizamos ambos nombres del backend:
   * login usa 'current_branch', register no lo tiene.
   */
  sucursalActiva: user.current_branch ?? null,

  sessionId,

  contexto: user.contexto
    ? {
        tipo: user.contexto.tipo,
        businessActual: user.contexto.business_actual,
        businessIds: user.contexto.business_ids,
      }
    : undefined,
});
