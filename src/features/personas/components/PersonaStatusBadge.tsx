// src/features/personas/components/PersonaStatusBadge.tsx
import { Badge } from "antd";
import type { EstadoPersona } from "@/shared/types/auth.types";

interface PersonaStatusBadgeProps {
  estado: EstadoPersona;
}

const STATUS_CONFIG: Record<
  EstadoPersona,
  { status: "success" | "error"; text: string }
> = {
  ACTIVO: { status: "success", text: "Activo" },
  INACTIVO: { status: "error", text: "Inactivo" },
};

export const PersonaStatusBadge = ({ estado }: PersonaStatusBadgeProps) => {
  const { status, text } = STATUS_CONFIG[estado] ?? STATUS_CONFIG.INACTIVO;

  return <Badge status={status} text={text} />;
};
