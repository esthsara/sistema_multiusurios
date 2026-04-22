import type {
  TipoContactoSucursal,
  SucursalContacto,
  CreateSucursalContactoDto,
  UpdateSucursalContactoDto,
} from "../../../types/sucursal.types";

/* ── Contacto ── */
export type Contacto = SucursalContacto;

export type CreateContactoDto = CreateSucursalContactoDto;

export type UpdateContactoDto = UpdateSucursalContactoDto;

export const TIPO_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "TELEFONO", label: "Teléfono" },
  { value: "OTRO", label: "Otro" },
];

export const TIPO_COLOR: Record<TipoContactoSucursal, string> = {
  EMAIL: "var(--color-gray-500)",
  TELEFONO: "var(--color-gray-500)",
  OTRO: "var(--color-gray-500)",
};

export const PLACEHOLDERS: Record<string, string> = {
  EMAIL: "ejemplo@correo.com",
  TELEFONO: "+591 70000000",
  OTRO: "Ingresa el detalle del contacto...",
};
