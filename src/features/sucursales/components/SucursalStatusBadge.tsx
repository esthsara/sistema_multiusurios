import { Badge } from "antd";

interface SucursalStatusBadgeProps {
  activa: boolean;
}

export const SucursalStatusBadge = ({ activa }: SucursalStatusBadgeProps) => {
  return (
    <Badge
      status={activa ? "success" : "error"}
      text={activa ? "Activa" : "Inactiva"}
    />
  );
};
