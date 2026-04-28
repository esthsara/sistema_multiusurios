// src/layouts/components/Header.tsx
import { Layout, Tooltip } from "antd";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { BranchSelector } from "./BranchSelector";
import { useTheme } from "@/shared/hooks/useTheme";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileOpen: () => void;
}

export const Header = ({ collapsed, onToggle, onMobileOpen }: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <AntHeader
      className="flex items-center justify-between px-4 gap-4"
      style={{
        backgroundColor: "var(--color-bg-base-2)",
        /*borderBottom: "1px solid var(--color-border)",*/
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "0 16px",
      }}
    >
      {/* ── Lado izquierdo ── */}
      <div className="flex items-center gap-3">
        {/* Toggle desktop */}
        <Tooltip title={collapsed ? "Expandir" : "Colapsar"} placement="bottom">
          <button
            onClick={onToggle}
            className="hidden md:flex items-center justify-center
                       w-8 h-8 rounded-lg transition-colors
                       hover:bg-[var(--color-bg-overlay)]"
          >
            {collapsed ? (
              <PanelLeftOpen
                size={18}
                style={{ color: "var(--color-text-secondary)" }}
              />
            ) : (
              <PanelLeftClose
                size={18}
                style={{ color: "var(--color-text-secondary)" }}
              />
            )}
          </button>
        </Tooltip>

        {/* Toggle móvil */}
        <button
          onClick={onMobileOpen}
          className="flex md:hidden items-center justify-center
                     w-8 h-8 rounded-lg transition-colors
                     hover:bg-[var(--color-bg-overlay)]"
        >
          <Menu size={18} style={{ color: "var(--color-text-secondary)" }} />
        </button>

        {/* Selector de sucursal */}
        <BranchSelector collapsed={false} />
      </div>

      {/* ── Lado derecho ── */}
      <div className="flex items-center gap-1">
        {/* Notificaciones */}
        <Tooltip title="Notificaciones" placement="bottom">
          <button
            className="flex items-center justify-center w-8 h-8
                       rounded-lg transition-colors
                       hover:bg-[var(--color-bg-overlay)]"
          >
            <Bell size={18} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        </Tooltip>

        {/* Configuración */}
        <Tooltip title="Configuración">
          <button
            className="flex items-center justify-center w-8 h-8
                       rounded-lg transition-colors
                       hover:bg-[var(--color-bg-overlay)]"
          >
            <Settings
              size={18}
              className="text-[var(--color-text-secondary)]"
            />
          </button>
        </Tooltip>

        {/* Toggle de tema */}
        <Tooltip
          title={isDark ? "Modo claro" : "Modo oscuro"}
          placement="bottom"
        >
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8
                       rounded-lg transition-colors
                       hover:bg-[var(--color-bg-overlay)]"
          >
            {isDark ? (
              <Sun size={18} style={{ color: "var(--color-text-secondary)" }} />
            ) : (
              <Moon
                size={18}
                style={{ color: "var(--color-text-secondary)" }}
              />
            )}
          </button>
        </Tooltip>
      </div>
    </AntHeader>
  );
};
