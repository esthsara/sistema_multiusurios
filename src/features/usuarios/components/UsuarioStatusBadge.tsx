// src/features/usuarios/components/UsuarioStatusBadge.tsx
import { Badge } from "antd";

interface UsuarioStatusBadgeProps {
  activo: boolean;
}

const STATUS_CONFIG: Record<
  "true" | "false",
  { status: "success" | "error"; text: string }
> = {
  true: { status: "success", text: "Activo" },
  false: { status: "error", text: "Inactivo" },
};

export const UsuarioStatusBadge = ({ activo }: UsuarioStatusBadgeProps) => {
  const { status, text } = STATUS_CONFIG[String(activo) as "true" | "false"];

  return <Badge status={status} text={text} />;
};
