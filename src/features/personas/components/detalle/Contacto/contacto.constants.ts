

export type TipoContacto = "EMAIL" | "TELEFONO" | "OTRO";

/* ── Contacto ── */
export interface Contacto {
  id: number;
  tipo: TipoContacto;
  tipo_texto: string;
  valor: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactoDto {
  persona_id: number;
  tipo: TipoContacto;
  valor: string;
}

export interface UpdateContactoDto {
  tipo: TipoContacto;
  valor: string;
}

export const TIPO_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "TELEFONO", label: "Teléfono" },
  { value: "OTRO", label: "Otro" },
];

export const TIPO_COLOR: Record<TipoContacto, string> = {
  EMAIL: "var(--color-blue-500)",
  TELEFONO: "var(--color-green-500)",
  OTRO: "var(--color-gray-500)",
};

export const PLACEHOLDERS: Record<string, string> = {
  EMAIL: "ejemplo@correo.com",
  TELEFONO: "+591 70000000",
  OTRO: "Ingresa el detalle del contacto...",
};
