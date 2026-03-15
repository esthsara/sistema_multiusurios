// src/layouts/components/UserMenu.tsx
import { Avatar, Dropdown } from "antd";
import { User, LogOut } from "lucide-react";
import type { MenuProps } from "antd";
import { useAuth } from "@/shared/hooks/useAuth";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

interface UserMenuProps {
  collapsed?: boolean;
}

export const UserMenu = ({ collapsed }: UserMenuProps) => {
  const { user } = useAuth();
  const { logout } = useAuthActions();

  const initials =
    user?.persona.nombreCompleto
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "U";

  const items: MenuProps["items"] = [
    {
      key: "info",
      label: (
        <div className="py-1 px-1">
          <p
            className="font-semibold text-sm m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.persona.nombreCompleto}
          </p>
          <p
            className="text-xs m-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {user?.email}
          </p>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "perfil",
      icon: <User size={14} />,
      label: "Mi Perfil",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: logout,
    },
  ];

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
              style={{ color: "#ffffff" }}
            >
              {user?.persona.nombreCompleto}
            </p>
            <p
              className="text-xs m-0 truncate"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {user?.roles[0]?.name ?? "Sin rol"}
            </p>
          </div>
        )}
      </div>
    </Dropdown>
  );
};
