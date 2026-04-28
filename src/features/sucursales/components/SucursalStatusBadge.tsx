// src/features/sucursales/components/SucursalStatusBadge.tsx
import { Badge } from "antd";

interface SucursalStatusBadgeProps {
  activa: boolean;
}

const STATUS_CONFIG = {
  true: { status: "success", text: "Activa" },
  false: { status: "error", text: "Inactiva" },
} as const;

export const SucursalStatusBadge = ({ activa }: SucursalStatusBadgeProps) => {
  const { status, text } = activa ? STATUS_CONFIG.true : STATUS_CONFIG.false;

  return <Badge status={status} text={text} />;
};
