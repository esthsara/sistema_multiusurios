// src/config/theme.config.ts
import type { ThemeConfig } from "antd";

/**
 * Tokens de Ant Design sincronizados con nuestros CSS tokens.
 *
 * ¿Por qué ThemeConfig y no un objeto genérico?
 * ThemeConfig es el tipo oficial de Ant Design que garantiza
 * que solo pasamos propiedades válidas al ConfigProvider.
 * Si Ant Design cambia una propiedad, TypeScript nos avisa.
 */

const baseTokens: ThemeConfig["token"] = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 4,
};

export const lightTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorPrimary: "#2563eb",
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",
    colorBorder: "#e2e8f0",
    colorText: "#0f172a",
    colorTextSecondary: "#64748b",
    colorTextDisabled: "#94a3b8",
  },
  components: {
    Layout: {
      siderBg: "#0f172a",
      triggerBg: "#1e293b",
      triggerColor: "#f8fafc",
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkSubMenuItemBg: "#1e293b",
      darkItemSelectedBg: "#2563eb",
      darkItemColor: "#94a3b8",
      darkItemSelectedColor: "#ffffff",
      darkItemHoverColor: "#f8fafc",
    },
    Table: {
      headerBg: "#f8fafc",
      rowHoverBg: "#eff6ff",
      borderColor: "#e2e8f0",
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorPrimary: "#3b82f6",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorBgBase: "#0f172a",
    colorBgContainer: "#1e293b",
    colorBgLayout: "#0f172a",
    colorBorder: "#334155",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorTextDisabled: "#475569",
  },
  components: {
    Layout: {
      siderBg: "#020617",
      triggerBg: "#0f172a",
      triggerColor: "#f8fafc",
    },
    Menu: {
      darkItemBg: "#020617",
      darkSubMenuItemBg: "#0f172a",
      darkItemSelectedBg: "#2563eb",
      darkItemColor: "#64748b",
      darkItemSelectedColor: "#ffffff",
      darkItemHoverColor: "#f8fafc",
    },
    Table: {
      headerBg: "#1e293b",
      rowHoverBg: "#334155",
      borderColor: "#334155",
    },
  },
};
