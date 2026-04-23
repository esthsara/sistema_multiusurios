import type {
  TipoDomicilioSucursal,
  SucursalDomicilio,
  CreateSucursalDomicilioDto,
  UpdateSucursalDomicilioDto,
} from "../../../types/sucursal.types";

export type TipoDomicilio = TipoDomicilioSucursal;

/* ── Domicilio ── */
export type Domicilio = SucursalDomicilio;

export type CreateDomicilioDto = CreateSucursalDomicilioDto;

export type UpdateDomicilioDto = UpdateSucursalDomicilioDto;

export const TIPO_OPTIONS = [
  { value: "FISCAL", label: "Fiscal" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "ENTREGA", label: "De entrega" },
  { value: "OTRO", label: "Otro" },
];

export const TIPO_COLOR: Record<TipoDomicilio, string> = {
  FISCAL: "#1d4ed8",
  PARTICULAR: "#166534",
  ENTREGA: "#6d28d9",
  OTRO: "#475569",
};

export const PLACEHOLDERS: Record<string, string> = {
  FISCAL: "Calle Fiscal, Número 456",
  PARTICULAR: "Calle Principal, Número 123",
  ENTREGA: "Dirección de entrega específica",
  OTRO: "Ingresa el detalle del domicilio...",
};
