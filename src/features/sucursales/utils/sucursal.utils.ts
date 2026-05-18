// src/features/sucursales/utils/sucursal.utils.ts
import { createElement, type ReactNode } from "react";
import { PowerOff, RotateCcw, Trash2 } from "lucide-react";
import type { SucursalListItem } from "../types/sucursal.types";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";

const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const getSucursalInitials = (nombre: string): string => {
  const parts = nombre.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) return "SC";
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

export const normalizeLogoUrl = (logo: string): string =>
  getResolvedFileUrl(logo);

export interface ConfirmConfig {
  title: string;
  description: string;
  confirmText: string;
  danger: boolean;
  icon: ReactNode;
}

export const getConfirmConfig = (
  type: "toggle" | "delete",
  sucursal?: SucursalListItem | null,
): ConfirmConfig => {
  if (type === "toggle") {
    const isActive = sucursal?.activa ?? false;
    return {
      title: isActive
        ? `¿Deseas desactivar ${sucursal?.nombre ?? "esta sucursal"}?`
        : `¿Deseas activar ${sucursal?.nombre ?? "esta sucursal"}?`,
      description: isActive
        ? "La sucursal quedará inactiva para nuevas operaciones y asignaciones."
        : "La sucursal volverá a estar disponible para operar y asignarse.",
      confirmText: isActive ? "Desactivar" : "Activar",
      danger: isActive,
      icon: isActive
        ? createElement(PowerOff, { size: 22, className: "text-yellow-400" })
        : createElement(RotateCcw, { size: 22, className: "text-green-400" }),
    };
  }

  return {
    title: `¿Enviar ${sucursal?.nombre ?? "esta sucursal"} a papelera?`,
    description:
      "Se desactivará la sucursal usando toggle-status y dejará de mostrarse en la vista principal.",
    confirmText: "Enviar a papelera",
    danger: true,
    icon: createElement(Trash2, { size: 22, className: "text-red-400" }),
  };
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HORARIO DISPLAY */

export const getHorarioDisplay = (sucursal: SucursalListItem): string => {
  return (
    sucursal.horario ||
    `${sucursal.horario_apertura ?? ""} - ${sucursal.horario_cierre ?? ""}`.trim()
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FORM DEFAULTS & VALIDATION */

export const DEFAULT_VALUES = {
  HORA_APERTURA: "08:00",
  HORA_CIERRE: "18:00",
  ESTADO_ACTIVO: true,
} as const;

export const VALIDATION_RULES = {
  required: (fieldLabel: string) => [
    {
      required: true,
      message: `${fieldLabel} es requerido`,
      whitespace: true,
    },
  ],

  email: () => [
    { required: true, message: "El email es requerido", whitespace: true },
    { type: "email" as const, message: "Email inválido" },
  ],

  time: (fieldLabel: string) => [
    { required: true, message: `${fieldLabel} es requerida` },
    {
      pattern: TIME_24H_REGEX,
      message: "Formato inválido. Usa HH:mm (24h)",
    },
  ],
};
