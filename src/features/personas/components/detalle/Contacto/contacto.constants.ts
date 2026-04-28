

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

export const PLACEHOLDERS: Record<string, string> = {
  EMAIL: "ejemplo@correo.com",
  TELEFONO: "+591 70000000",
  OTRO: "Ingresa el detalle del contacto...",
};
