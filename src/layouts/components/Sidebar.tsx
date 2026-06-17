// src/layouts/components/Sidebar.tsx
import { useEffect, useMemo, useState } from "react";
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
import "./Sidebar.css";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}


/**
 * userCanSee — Verifica si el usuario puede ver un ítem
 * • Sin permisos requeridos → visible para todos
 * • Con permisos → necesita AL MENOS uno (OR lógico)
 */
const userCanSee = (
  item: NavItem,
  hasAnyPerm: (p: PermissionString[]) => boolean,
): boolean => {
  if (item.permissions.length === 0) return true;
  return hasAnyPerm(item.permissions);
};

/**
 * filterNavItems — Filtra recursivamente el árbol de navegación
 * • Oculta items sin permisos
 * • Oculta grupos (parent) sin hijos visibles
 */
const filterNavItems = (
  items: NavItem[],
  hasAnyPerm: (p: PermissionString[]) => boolean,
): NavItem[] => {
  return items.reduce<NavItem[]>((acc, item) => {
    if (item.children) {
      const visibleChildren = filterNavItems(item.children, hasAnyPerm);
      const canSeeSelf = userCanSee(item, hasAnyPerm);

      if (visibleChildren.length === 0 && !canSeeSelf) return acc;

      if (visibleChildren.length > 0) {
        acc.push({ ...item, children: visibleChildren });
        return acc;
      }

      if (canSeeSelf) {
        acc.push(item);
      }
    } else if (userCanSee(item, hasAnyPerm)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

/* ═══════════════════════════════════════════════════════════════*/
/**
 * buildMenuItems — Convierte NavItem[] al formato de Ant Design Menu
 * • Renderiza grupos (submenus) y items individuales
 * • Maneja iconografía de cada ítem
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

/**
 * findActiveLeafKey — Encuentra el ítem más específico que coincide con la ruta actual
 * • Busca el path más largo (más específico)
 * • Retorna el key del ítem activo
 */
const findActiveLeafKey = (
  items: NavItem[],
  pathname: string,
): string | null => {
  let bestMatchKey: string | null = null;
  let bestMatchLength = -1;

  const walk = (nodes: NavItem[]) => {
    nodes.forEach((node) => {
      if (node.path && pathname.startsWith(node.path)) {
        if (node.path.length > bestMatchLength) {
          bestMatchKey = node.path;
          bestMatchLength = node.path.length;
        }
      }

      if (node.children) {
        walk(node.children);
      }
    });
  };

  walk(items);
  return bestMatchKey;
};

/**
 * findParentSubmenuKey — Encuentra el grupo parent que debe estar expandido
 * • Navega el árbol hasta encontrar el padre del ítem actual
 * • Retorna null si es un ítem root
 */
const findParentSubmenuKey = (
  items: NavItem[],
  pathname: string,
  currentParent?: string,
): string | null => {
  for (const item of items) {
    const nextParent = item.children ? item.key : currentParent;

    if (item.path && pathname.startsWith(item.path)) {
      return currentParent ?? null;
    }

    if (item.children) {
      const childMatch = findParentSubmenuKey(
        item.children,
        pathname,
        nextParent,
      );
      if (childMatch) return childMatch;
    }
  }
  return null;
};

/**
 * getRootSubmenuKeys — Retorna todas las keys de los submenus root
 * • Usado para controlar qué submenus pueden estar abiertos
 * • Asegura que solo un grupo pueda estar expandido a la vez
 */
const getRootSubmenuKeys = (items: NavItem[]): string[] => {
  return items.filter((item) => item.children?.length).map((item) => item.key);
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Logo Mark
═══════════════════════════════════════════════════════════════ */

const LogoMark = () => (
  <div 
    className="saas-sidebar-logo-mark" 
    aria-label="Logo"
    style={{ background: 'transparent', border: 'none' }}
  >
    <img 
      src="/image/icon/icon.png" 
      alt="Logo" 
      className="w-full h-full object-contain"
      style={{ borderRadius: '10px' }}
    />
  </div>
);
/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Sidebar Header
═══════════════════════════════════════════════════════════════ */

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => (
  <div className="saas-sidebar-header">
    {isCollapsed ? (
      <LogoMark />
    ) : (
      <div className="saas-sidebar-brand">
        <LogoMark />
        <div className="min-w-0">
          <span className="saas-sidebar-brand-title">Panel Admin</span>
          <p className="saas-sidebar-brand-subtitle">Control Center</p>
        </div>
      </div>
    )}
  </div>
);



const SidebarCurve = () => (
  <div className="saas-sidebar-curve" aria-hidden>
    <svg viewBox="0 0 574 566" preserveAspectRatio="none">
      <path
        d="M9.69214e-05 0.000290273H573.035V565.393C569.9 504.502 543.35 343.134 362.267 179.764C204.661 37.5738 69.3529 5.8904 9.69214e-05 0.000290273Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Sidebar Menu Wrapper
═══════════════════════════════════════════════════════════════ */

interface SidebarMenuWrapperProps {
  items: MenuProps["items"];
  selectedKeys: string[];
  openKeys: string[];
  isCollapsed: boolean;
  onOpenChange: MenuProps["onOpenChange"];
  onMenuClick: MenuProps["onClick"];
}

const SidebarMenuWrapper = ({
  items,
  selectedKeys,
  openKeys,
  isCollapsed,
  onOpenChange,
  onMenuClick,
}: SidebarMenuWrapperProps) => (
  <div className="saas-sidebar-menu-wrap">
    <Menu
      mode="inline"
      theme="dark"
      items={items}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      inlineCollapsed={isCollapsed}
      onClick={onMenuClick}
      inlineIndent={18}
      className="saas-sidebar-menu"
    />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Sidebar Footer with User Menu
═══════════════════════════════════════════════════════════════ */

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooterUser = ({ isCollapsed }: SidebarFooterProps) => (
  <div className="saas-sidebar-footer">
    <UserMenu collapsed={isCollapsed} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Sidebar Content (Composición principal)
═══════════════════════════════════════════════════════════════ */

interface SidebarContentProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  items: MenuProps["items"];
  selectedKeys: string[];
  openKeys: string[];
  onOpenChange: MenuProps["onOpenChange"];
  onMenuClick: MenuProps["onClick"];
}

const SidebarContent = ({
  isCollapsed,
  isMobile = false,
  items,
  selectedKeys,
  openKeys,
  onOpenChange,
  onMenuClick,
}: SidebarContentProps) => (
  <div
    className={`saas-sidebar-shell ${isCollapsed ? "is-collapsed" : ""} ${
      isMobile ? "is-mobile" : ""
    }`}
    
  >
    {/* Ambient Background */}
    <div className="saas-sidebar-ambient" aria-hidden />

    {/* Header with Logo */}
    <SidebarHeader isCollapsed={isCollapsed} />

    {/* Decorative Curve */}
    <SidebarCurve />

    {/* Navigation Menu */}
    <SidebarMenuWrapper
      items={items}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      isCollapsed={isCollapsed}
      onOpenChange={onOpenChange}
      onMenuClick={onMenuClick}
    />

    {/* User Menu Footer */}
    <SidebarFooterUser isCollapsed={isCollapsed} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Mobile Overlay
═══════════════════════════════════════════════════════════════ */

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileOverlay = ({ isOpen, onClose }: MobileOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="saas-sidebar-mobile-overlay md:hidden"
      onClick={onClose}
      role="button"
      aria-label="Close sidebar"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Mobile Drawer Panel
═══════════════════════════════════════════════════════════════ */

interface MobileDrawerProps {
  isOpen: boolean;
  items: MenuProps["items"];
  selectedKeys: string[];
  openKeys: string[];
  onOpenChange: MenuProps["onOpenChange"];
  onMenuClick: MenuProps["onClick"];
}

const MobileDrawer = ({
  isOpen,
  items,
  selectedKeys,
  openKeys,
  onOpenChange,
  onMenuClick,
}: MobileDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="saas-sidebar-mobile-panel md:hidden">
      <SidebarContent
        isCollapsed={false}
        isMobile={true}
        items={items}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onMenuClick={onMenuClick}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT: Sidebar
═══════════════════════════════════════════════════════════════ */

export const Sidebar = ({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAnyPermission, user } = useAuth();
  const [hoverExpanded, setHoverExpanded] = useState(false);

  /* ──────────────────────────────────────────
     STATE: Computed Values & Memoization
  ────────────────────────────────────────── */

  const filteredNav = useMemo(() => {
    return filterNavItems(NAV_CONFIG, hasAnyPermission);
  }, [hasAnyPermission, user]);

  const menuItems = useMemo(() => buildMenuItems(filteredNav), [filteredNav]);

  const rootSubmenuKeys = useMemo(
    () => getRootSubmenuKeys(filteredNav),
    [filteredNav],
  );

  const selectedKeys = useMemo(() => {
    const active = findActiveLeafKey(filteredNav, location.pathname);
    return active ? [active] : [location.pathname];
  }, [filteredNav, location.pathname]);

  const desktopIsCollapsed = collapsed && !hoverExpanded;

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /* ──────────────────────────────────────────
     EFFECTS: Side Effects & State Sync
  ────────────────────────────────────────── */

  useEffect(() => {
    if (collapsed) setHoverExpanded(false);
  }, [collapsed]);

  useEffect(() => {
    const shouldCollapseMenus = desktopIsCollapsed && !mobileOpen;

    if (shouldCollapseMenus) {
      setOpenKeys([]);
      return;
    }

    const currentParent = findParentSubmenuKey(filteredNav, location.pathname);
    setOpenKeys(currentParent ? [currentParent] : []);
  }, [desktopIsCollapsed, mobileOpen, filteredNav, location.pathname]);

  /* ──────────────────────────────────────────
     HANDLERS: Event Callbacks
  ────────────────────────────────────────── */

  const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));

    if (!latestOpenKey) {
      setOpenKeys([]);
      return;
    }

    if (rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys([latestOpenKey]);
      return;
    }

    setOpenKeys(keys.slice(-1));
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
      onMobileClose();
    }
  };

  const handleMouseEnter = () => {
    if (collapsed) setHoverExpanded(true);
  };

  const handleMouseLeave = () => {
    setHoverExpanded(false);
  };

  /* ──────────────────────────────────────────
     RENDER: Component Output
  ────────────────────────────────────────── */

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DESKTOP SIDEBAR (hidden on mobile)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Sider
        collapsible
        collapsed={desktopIsCollapsed}
        onCollapse={onCollapse}
        width={260}
        collapsedWidth={76}
        className="saas-sidebar hidden md:flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: "transparent",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflow: "visible",
          flexShrink: 0,
        }}
        trigger={null}
      >
        <SidebarContent
          isCollapsed={desktopIsCollapsed}
          isMobile={false}
          items={menuItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onMenuClick={handleMenuClick}
        />
      </Sider>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE DRAWER (visible on mobile)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <MobileOverlay isOpen={mobileOpen} onClose={onMobileClose} />
      <MobileDrawer
        isOpen={mobileOpen}
        items={menuItems}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onMenuClick={handleMenuClick}
      />
    </>
  );
};
