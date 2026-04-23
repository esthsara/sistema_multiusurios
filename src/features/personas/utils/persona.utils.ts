// src/features/personas/utils/persona.utils.ts
import { PowerOff, RotateCcw, Trash2 } from "lucide-react"
import React from "react"
import type { ReactNode } from "react"
import type { PersonaListItem } from "../types/persona.types"
import type { EstadoPersona } from "@/shared/types/auth.types"



export const getPersonaInitials = (persona: PersonaListItem): string => {
  if (persona.tipo_persona === "FISICA") {
    const nombre = (persona.nombre ?? "").trim()
    const apellido = (persona.apellido ?? "").trim()

    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
    }

    if (nombre) {
      const initials = nombre
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
      return initials || "P"
    }

    return "P"
  }

  const source = (persona.razon_social ?? persona.display_name ?? "").trim()
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "M"
}

export const getAvatarStyle = (
  persona: PersonaListItem,
): React.CSSProperties => {
  if (persona.foto) {
    return { backgroundColor: "var(--color-bg-overlay)" }
  }

  if (persona.tipo_persona === "FISICA") {
    return {
      backgroundColor:
        "color-mix(in srgb, var(--color-primary-600) 72%, var(--color-bg-base) 28%)",
      color: "var(--color-text-inverse)",
      fontWeight: 700,
    }
  }

  return {
    backgroundColor:
      "color-mix(in srgb, var(--color-primary-400) 32%, var(--color-bg-overlay) 68%)",
    color: "var(--color-text-inverse)",
    fontWeight: 700,
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONFIRM MODAL CONFIG */

export type IconType = "poweroff" | "rotateccw" | "trash2"

export interface ConfirmConfig {
  title: string
  description: string
  confirmText: string
  danger: boolean
  iconType: IconType
}

export const getConfirmConfig = (
  type: "toggle" | "delete",
  estado?: EstadoPersona,
  displayName?: string | null,
): ConfirmConfig => {
  if (type === "toggle") {
    const isActive = estado === "ACTIVO"
    return {
      title: isActive
        ? `Desactivar a ${displayName ?? "esta persona"}`
        : `Activar a ${displayName ?? "esta persona"}`,
      description: isActive
        ? "Esta persona dejará de tener acceso al sistema."
        : "La persona podrá volver a utilizar el sistema.",
      confirmText: isActive ? "Desactivar" : "Activar",
      danger: isActive,
      iconType: isActive ? "poweroff" : "rotateccw",
    }
  }

  return {
    title: "Eliminar persona",
    description: `Se eliminará a ${displayName ?? "esta persona"}. No podrás restaurarla más adelante.`,
    confirmText: "Eliminar",
    danger: true,
    iconType: "trash2",
  }
}

export const getConfirmIcon = (iconType: IconType): ReactNode => {
  switch (iconType) {
    case "poweroff":
      return React.createElement(PowerOff, {
        size: 22,
        className: "text-yellow-400",
      })
    case "rotateccw":
      return React.createElement(RotateCcw, {
        size: 22,
        className: "text-green-400",
      })
    case "trash2":
      return React.createElement(Trash2, {
        size: 22,
        className: "text-red-400",
      })
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DISPLAY NAME */

export const getDisplayName = (persona: PersonaListItem): string => {
  if (persona.tipo_persona === "FISICA") {
    return (
      `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim() ||
      persona.display_name ||
      "Sin nombre"
    )
  }
  return persona.razon_social || persona.display_name || "Sin nombre"
}