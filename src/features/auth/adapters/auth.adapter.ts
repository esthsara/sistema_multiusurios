// src/features/auth/adapters/auth.adapter.ts
// Este archivo contiene funciones para adaptar los datos del backend a la forma que usamos en el frontend.

import type {
  BackendUser,
  BackendPersona,
  BackendRole,
  BackendRoleObject,
  BackendBusiness,
  BackendSucursal,
  AccessTokenObject,
  AuthUser,
  Persona,
  Sucursal,
} from "@/shared/types/auth.types";

/**
 * getNombreCompleto — Calcula el nombre según tipo_persona.
 * FISICA → "Juan Carlos Pérez Gómez"
 * MORAL  → "Empresa Boliviana SRL"
 */
const getNombreCompleto = (persona: BackendPersona): string => {
  if (persona.nombre_completo) {
    return persona.nombre_completo;
  }

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
  tipoTexto: persona.tipo_texto,
  nombre: persona.nombre,
  apellido: persona.apellido,
  razonSocial: persona.razon_social,
  identificacionPrincipal: persona.identificacion_principal,
  fechaNacimiento: persona.fecha_nacimiento,
  genero: persona.genero,
  fotoPatch: persona.foto_path ?? persona.foto ?? null,
  estado: persona.estado,
  estadoTexto: persona.estado_texto,
  nombreCompleto: getNombreCompleto(persona),
});

const isRoleObject = (role: BackendRole): role is BackendRoleObject => {
  return typeof role === "object" && role !== null;
};

const adaptRole = (role: BackendRole, index: number) => {
  if (!isRoleObject(role)) {
    return {
      id: -(index + 1),
      name: role,
      permisos: [],
    };
  }

  return {
    id: role.id ?? -(index + 1),
    name: role.name,
    permisos: role.permissions ?? role.permisos ?? [],
  };
};

const resolveSucursalClave = (
  sucursal: BackendSucursal | BackendBusiness,
): string => {
  if ("clave" in sucursal && sucursal.clave) return sucursal.clave;
  if ("codigo" in sucursal && sucursal.codigo) return sucursal.codigo;
  return "";
};

export const adaptSucursal = (
  sucursal: BackendSucursal | BackendBusiness,
): Sucursal => ({
  id: sucursal.id,
  nombre: sucursal.nombre,
  clave: resolveSucursalClave(sucursal),
});

const adaptBusinessActual = (
  businessActual: BackendBusiness | BackendSucursal | number | null | undefined,
) => {
  if (businessActual === null || businessActual === undefined) return null;
  if (typeof businessActual === "number") return businessActual;

  return adaptSucursal(businessActual);
};

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
): AuthUser => {
  const businessActual = adaptBusinessActual(user.contexto?.business_actual);
  const inferredSucursalActiva =
    businessActual && typeof businessActual !== "number"
      ? businessActual
      : null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    activo: user.activo,
    persona: adaptPersona(user.persona),

    roles: (user.roles ?? []).map(adaptRole),

    /**
     * 'permisos' — viene del /auth/me directamente.
     * En login/register puede venir vacío y se llena con /auth/me.
     */
    permisos: user.permisos ?? [],

    sucursales: (user.sucursales ?? []).map(adaptSucursal),

    /**
     * sucursalActiva — normalizamos ambos nombres del backend:
     * login usa 'current_branch', register no lo tiene.
     */
    sucursalActiva: user.current_branch
      ? adaptSucursal(user.current_branch)
      : inferredSucursalActiva,

    sessionId,

    contexto: user.contexto
      ? {
          tipo: user.contexto.tipo,
          businessActual,
          businessIds: user.contexto.business_ids ?? [],
        }
      : undefined,
  };
};
