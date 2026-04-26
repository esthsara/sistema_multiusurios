import type {
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


export const PLACEHOLDERS: Record<string, string> = {
  EMAIL: "ejemplo@correo.com",
  TELEFONO: "+591 70000000",
  OTRO: "Ingresa el detalle del contacto...",
};

export interface ContactoFormValues {
  tipo: Contacto["tipo"];
  valor: string;
}