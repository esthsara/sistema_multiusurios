// src/config/theme.config.ts
import type { ThemeConfig } from "antd";

/**
colores de los items de ant desing
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
    colorBgLayout: "#ffffff",
    colorBorder: "#e2e8f0",
    colorText: "#1e293b",
    colorTextSecondary: "#64748b",
    colorTextDisabled: "#94a3b8",
  },
  components: {
    Layout: {
      siderBg: "#021024",
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
      headerColor: "#1e293b",
      rowHoverBg: "#f0f7ff",
      borderColor: "#e2e8f0",
      colorBgContainer: "#ffffff",
      colorText: "#1e293b",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e2e8f0",
      colorText: "#1e293b",
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e2e8f0",
      colorText: "#1e293b",
    },
    Button: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e2e8f0",
      colorText: "#1e293b",
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
    colorBgBase: "#1e293b",
    colorBgContainer: "#1e293b",
    colorBgLayout: "#1e293b",
    colorBorder: "#334155",
    colorText: "#f1f5f9",
    colorTextSecondary: "#cbd5e1",
    colorTextDisabled: "#64748b",
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
      headerBg: "#334155",
      headerColor: "#f1f5f9",
      rowHoverBg: "#273547",
      borderColor: "#334155",
      colorBgContainer: "#1e293b",
      colorText: "#f1f5f9",
    },
    Input: {
      colorBgContainer: "#1e293b",
      colorBorder: "#334155",
      colorText: "#f1f5f9",
    },
    Select: {
      colorBgContainer: "#1e293b",
      colorBorder: "#334155",
      colorText: "#f1f5f9",
    },
    Button: {
      colorBgContainer: "#1e293b",
      colorBorder: "#334155",
      colorText: "#f1f5f9",
    },
  },
};
