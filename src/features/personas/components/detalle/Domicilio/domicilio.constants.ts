

export type TipoDomicilio = "FISCAL" | "PARTICULAR" | "ENTREGA" | "OTRO";


/* ── Domicilio ── */
export interface Domicilio {
  id: number;
  tipo: TipoDomicilio;
  tipo_texto: string;
  pais: string;
  ciudad: string;
  direccion: string;
  codigo_postal: string | null;
  principal: boolean;
  created_at: string;
  updated_at: string;

}

export interface CreateDomicilioDto {
  persona_id: number;
  tipo: TipoDomicilio;
  direccion: string;
  ciudad: string;
  pais: string;
  codigo_postal?: string;
  principal?: boolean;
}

export type UpdateDomicilioDto = Partial<
  Omit<CreateDomicilioDto, "persona_id">
>;

export const TIPO_OPTIONS = [
  { value: "FISCAL", label: "Fiscal" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "ENTREGA", label: "De entrega" },
  { value: "OTRO", label: "Otro" },
];


export const TIPO_COLOR: Record<TipoDomicilio, string> = {
  FISCAL: "var(--color-blue-500)",
  PARTICULAR: "var(--color-green-500)",
  ENTREGA: "var(--color-purple-500)",
  OTRO: "var(--color-gray-500)",
};

export const PLACEHOLDERS: Record<string, string> = {
  FISCAL: "Calle Fiscal, Número 456",
  PARTICULAR: "Calle Principal, Número 123",
  ENTREGA: "Dirección de entrega específica",
  OTRO: "Ingresa el detalle del domicilio...",
};