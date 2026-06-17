// src/layouts/components/UserMenu.tsx
import { useMemo } from "react";
import { Avatar, Dropdown } from "antd";
import { LogOut, UserRound } from "lucide-react";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { safeText } from "@/shared/utils/sanitize";
import { getAvatarUrl } from "@/shared/utils/avatar";
/* Componente para el menú del usuario en la barra de navegación  este junta las iniciales y lo covierte en uno solo*/
interface UserMenuProps {
  collapsed?: boolean;
}

export const UserMenu = ({ collapsed }: UserMenuProps) => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const safeName = safeText(user?.persona.nombreCompleto, "Usuario", 120);
  const safeEmail = safeText(user?.email, "Sin email", 120);
  const safeRole = safeText(user?.roles[0]?.name, "Sin rol", 80);

  const initials = useMemo(() => {
    return safeName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";
  }, [safeName]);

  const items: MenuProps["items"] = useMemo(() => [
    {
      key: "info",
      label: (
        <div className="py-1 px-1">
          <p
            className="font-semibold text-sm m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {safeName}
          </p>
          <p
            className="text-xs m-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {safeEmail}
          </p>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserRound size={14} />,
      label: "Mi Perfil",
      onClick: () => navigate(APP_ROUTES.DASHBOARD.PROFILE),
    },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: logout,
    },
  ], [safeName, safeEmail, navigate, logout]);

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="topLeft">
      <div
        className="flex items-center gap-2 px-2 py-1.5
                      rounded-lg cursor-pointer transition-colors
                      hover:bg-white/10"
        style={{ maxWidth: collapsed ? 40 : 200 }}
      >
        <Avatar
          size={32}
          src={getAvatarUrl(user)}
          style={{
            backgroundColor: "var(--color-primary-600)",
            fontSize: "0.75rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initials}
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold m-0 truncate"
              style={{ color: "var(--color-primary-600)" }}
            >
              {safeName}
            </p>
            <p
              className="text-xs m-0 truncate"
              style={{ color: "var(--color-primary-400)" }}
            >
              {safeRole}
            </p>
          </div>
        )}
      </div>
    </Dropdown>
  );
};
