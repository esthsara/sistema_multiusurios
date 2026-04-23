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
  EMAIL: "#1d4ed8",
  TELEFONO: "#166534",
  OTRO: "#475569",
};

export const PLACEHOLDERS: Record<string, string> = {
  EMAIL: "ejemplo@correo.com",
  TELEFONO: "+591 70000000",
  OTRO: "Ingresa el detalle del contacto...",
};
