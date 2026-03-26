import { Badge } from "antd";

interface UsuarioStatusBadgeProps {
  activo: boolean;
}

export const UsuarioStatusBadge = ({ activo }: UsuarioStatusBadgeProps) => {
  const config = {
    true: { status: "success" as const, text: "Activo" },
    false: { status: "error" as const, text: "Inactivo" },
  };

  const { status, text } =
    config[String(activo) as keyof typeof config] ?? config.false;

  return <Badge status={status} text={text} />;
};

