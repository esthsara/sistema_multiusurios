// src/features/usuarios/utils/usuario.utils.ts
import { createElement, type CSSProperties, type ReactNode } from "react";
import { Key, PowerOff, RotateCcw, Trash2 } from "lucide-react";
import type { UsuarioListItem } from "../types/usuario.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FORMATTERS */

type PersonaShape = UsuarioListItem["persona"];

export const getPersonaDisplayName = (persona: PersonaShape): string => {
  const nombre = `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim();
  return (persona.razon_social ?? nombre).trim() || "Sin nombre";
};

export const getUsuarioDisplayName = (
  usuario: Pick<UsuarioListItem, "persona">,
): string => getPersonaDisplayName(usuario.persona);

export const getUsuarioInitials = (
  usuario: Pick<UsuarioListItem, "persona">,
): string => {
  const displayName = getUsuarioDisplayName(usuario);
  return (
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AVATAR STYLES */

export const getAvatarStyle = (usuario: UsuarioListItem): CSSProperties => {
  if (usuario.persona.foto) {
    return { backgroundColor: "var(--color-bg-overlay)" };
  }

  if (usuario.persona.tipo_persona === "FISICA") {
    return {
      backgroundColor:
        "color-mix(in srgb, var(--color-primary-600) 72%, var(--color-bg-base) 28%)",
      color: "var(--color-text-inverse)",
      fontWeight: 700,
    };
  }

  return {
    backgroundColor:
      "color-mix(in srgb, var(--color-primary-400) 32%, var(--color-bg-overlay) 68%)",
    color: "var(--color-text-inverse)",
    fontWeight: 700,
  };
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONFIRM MODAL CONFIG */

import type { ConfirmConfig } from "@/shared/types/ui.types";

export const getConfirmConfig = (
  type: "toggle" | "delete",
  usuario?: UsuarioListItem | null,
): ConfirmConfig => {
  if (type === "toggle") {
    const isActive = usuario?.activo ?? false;
    return {
      title: isActive
        ? "¿Deseas desactivar este usuario?"
        : "¿Deseas activar este usuario nuevamente?",
      description: isActive
        ? "El usuario no podrá iniciar sesión ni acceder a nuevas funcionalidades."
        : "El usuario podrá iniciar sesión y utilizar las funcionalidades disponibles.",
      confirmText: isActive ? "Desactivar" : "Activar",
      danger: isActive,
      icon: isActive
        ? createElement(PowerOff, { size: 22, className: "text-yellow-400" })
        : createElement(RotateCcw, { size: 22, className: "text-green-400" }),
    };
  }

  return {
    title: `¿Seguro que deseas eliminar a ${usuario?.username ?? "este usuario"}?`,
    description:
      "Se aplicará una baja lógica (soft delete). Podrás restaurar el usuario después.",
    confirmText: "Eliminar",
    danger: true,
    icon: createElement(Trash2, { size: 22, className: "text-red-400" }),
  };
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FORM VALIDATION */

export const VALIDATION_RULES = {
  required: (fieldLabel: string) => [
    {
      required: true,
      message: `${fieldLabel} es requerida`,
      whitespace: true,
    },
  ],

  email: () => [
    { required: true, message: "El email es requerido", whitespace: true },
    { type: "email" as const, message: "Email inválido" },
  ],
};
