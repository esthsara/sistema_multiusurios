// src/layouts/components/Sidebar.tsx
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Layout } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import {
  NAV_CONFIG,
  type NavItem,
} from "@/shared/constants/navigation.constants";
import type { PermissionString } from "@/shared/types/auth.types";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RBAC FILTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * userCanSee — Verifica si el usuario puede ver un ítem.
 * Sin permisos requeridos → visible para todos.
 * Con permisos → necesita AL MENOS uno (OR lógico).
 */
const userCanSee = (
  item: NavItem,
  hasAnyPerm: (p: PermissionString[]) => boolean,
): boolean => {
  if (item.permissions.length === 0) return true;
  return hasAnyPerm(item.permissions);
};

/**
 * filterNavItems — Filtra recursivamente el árbol de navegación.
 * Un grupo (parent) sin hijos visibles también se oculta.
 */
const filterNavItems = (
  items: NavItem[],
  hasAnyPerm: (p: PermissionString[]) => boolean,
): NavItem[] => {
  return items.reduce<NavItem[]>((acc, item) => {
    if (!userCanSee(item, hasAnyPerm)) return acc;

    if (item.children) {
      const visibleChildren = filterNavItems(item.children, hasAnyPerm);
      if (visibleChildren.length === 0) return acc;
      acc.push({ ...item, children: visibleChildren });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MENU ITEMS BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * buildMenuItems — Convierte NavItem[] al formato de Ant Design Menu.
 * Separamos la lógica de datos de la lógica de renderizado.
 */
const buildMenuItems = (items: NavItem[]): MenuProps["items"] => {
  return items.map((item) => {
    const Icon = item.icon;

    if (item.children) {
      return {
        key: item.key,
        icon: Icon ? <Icon size={18} /> : undefined,
        label: item.label,
        children: buildMenuItems(item.children),
      };
    }

    return {
      key: item.path ?? item.key,
      icon: Icon ? <Icon size={18} /> : undefined,
      label: item.label,
    };
  });
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMPONENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const Sidebar = ({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAnyPermission } = useAuth();

  /**
   * useMemo — el menú se recalcula solo si cambian
   * los permisos del usuario. No en cada render.
   */
  const menuItems = useMemo(() => {
    const filtered = filterNavItems(NAV_CONFIG, hasAnyPermission);
    return buildMenuItems(filtered);
  }, [hasAnyPermission]);

  /**
   * selectedKeys — resalta el ítem activo según la ruta actual.
   * openKeys se calcula para expandir el grupo correcto.
   */
  const selectedKeys = [location.pathname];

  const defaultOpenKeys = useMemo(() => {
    return NAV_CONFIG.filter((item) =>
      item.children?.some((child) =>
        location.pathname.startsWith(child.path ?? ""),
      ),
    ).map((item) => item.key);
  }, [location.pathname]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
      onMobileClose();
    }
  };

  const siderContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center justify-center h-16 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {collapsed ? (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            <span className="text-white font-bold text-sm">P</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-semibold text-base truncate">
              Panel Admin
            </span>
          </div>
        )}
      </div>

      {/* Menú — ocupa el espacio disponible */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden py-2"
        style={{ scrollbarWidth: "thin" }}
      >
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          inlineCollapsed={collapsed}
          onClick={handleMenuClick}
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "0.875rem",
          }}
        />
      </div>

      {/* User Menu — anclado al fondo */}
      <div
        className="flex-shrink-0 p-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={240}
        collapsedWidth={64}
        className="hidden md:flex flex-col"
        style={{
          backgroundColor: "var(--color-bg-sidebar)",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          flexShrink: 0,
        }}
        trigger={null}
      >
        {siderContent}
      </Sider>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onMobileClose}
          />
          {/* Panel */}
          <div
            className="fixed left-0 top-0 h-full z-50 md:hidden"
            style={{
              width: 240,
              backgroundColor: "var(--color-bg-sidebar)",
            }}
          >
            {siderContent}
          </div>
        </>
      )}
    </>
  );
};
