// src/config/theme.config.ts
import type { ThemeConfig } from "antd";

/** Tokens base y paletas de color para los temas claro/oscuro de Ant Design. */

const baseTokens: ThemeConfig["token"] = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 4,
};

export const lightTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorPrimary: "#3b6fcf",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    //  FONDOS (neutros, no azulados)
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",

    colorBorder: "#e2e8f0",

    colorText: "#1e293b",
    colorTextSecondary: "#475569",
    colorTextDisabled: "#94a3b8",
    colorTextPlaceholder: "#64748b",
  },
  components: {
    Layout: {
      siderBg: "#0f172a", // consistente con sidebar
      triggerBg: "#1e293b",
      triggerColor: "#f8fafc",
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkSubMenuItemBg: "#1e293b",
      darkItemSelectedBg: "#3b6fcf",
      darkItemColor: "#94a3b8",
      darkItemSelectedColor: "#ffffff",
      darkItemHoverColor: "#f8fafc",
    },
    Table: {
      headerBg: "#f1f5f9",
      headerColor: "#1e293b",
      rowHoverBg: "#eef4ff",
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
    colorPrimary: "#486594",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",

    // FONDOS (gris oscuro elegante)
    colorBgBase: "#0f172a",
    colorBgContainer: "#1e293b",
    colorBgLayout: "#0f172a",

    // BORDES
    colorBorder: "#334155",

    // TEXTOS
    colorText: "#f1f5f9",
    colorTextSecondary: "#cbd5e1",
    colorTextDisabled: "#64748b",
    colorTextPlaceholder: "#94a3b8",
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
