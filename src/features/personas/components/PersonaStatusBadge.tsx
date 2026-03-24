// src/features/personas/components/PersonaStatusBadge.tsx
import { Badge } from "antd";
import type { EstadoPersona } from "@/shared/types/auth.types";

interface PersonaStatusBadgeProps {
  estado: EstadoPersona;
}
/* Componente para mostrar el estado de una persona con un badge de Ant Design */

export const PersonaStatusBadge = ({ estado }: PersonaStatusBadgeProps) => {
  const config = {
    ACTIVO: { status: "success" as const, text: "Activo" },
    INACTIVO: { status: "error" as const, text: "Inactivo" },
    BLOQUEADO: { status: "warning" as const, text: "Bloqueado" },
  };

  const { status, text } = config[estado] ?? config.INACTIVO;

  return <Badge status={status} text={text} />;
};
