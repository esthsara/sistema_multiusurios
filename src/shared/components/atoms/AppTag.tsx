import { Tag } from "antd";
import type { TagProps } from "antd";
import type { ReactNode } from "react";

type AppTagTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "cyan"
  | "geekblue"
  | "volcano"
  | "lime"
  | "magenta"
  | "gold"
  | "blue";

interface AppTagProps extends Omit<TagProps, "color"> {
  tone?: AppTagTone;
  icon?: ReactNode;
}

const TONE_STYLES: Record<
  AppTagTone,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  // NEUTRAL - gris suave  cuando no es importnate
  neutral: {
    backgroundColor: "var(--tag-neutral-bg)",
    color: "var(--tag-neutral-text)",
    borderColor: "var(--tag-neutral-border)",
  },

  // PRIMARY - azul principal (más visible)
  primary: {
    backgroundColor: "var(--color-alert-primary-bg)", // Aprovechamos tus variables existentes
    color: "var(--color-primary-600)",
    borderColor: "var(--color-primary-400)",
  },

  // SUCCESS - verde vibrante  para hechos suces
  success: {
    backgroundColor: "var(--color-alert-success-bg)",
    color: "var(--color-success-500)",
    borderColor: "var(--color-success-600)",
  },

  // WARNING - naranja vibrante hay un posible poblema
  warning: {
    backgroundColor: "var(--color-alert-warning-bg)",
    color: "var(--color-warning-500)",
    borderColor: "var(--color-warning-600)",
  },

  // DANGER - rojo vibrante hay un problema
  danger: {
    backgroundColor: "var(--color-alert-danger-bg)",
    color: "var(--color-danger-500)",
    borderColor: "var(--color-danger-600)",
  },

  // PURPLE - morado vibrante  morado por  
  purple: {
    backgroundColor: "var(--tag-purple-bg)",
    color: "var(--tag-purple-text)",
    borderColor: "var(--tag-purple-border)",
  },

  // CYAN - cian vibrante
  cyan: {
    backgroundColor: "var(--tag-cyan-bg)",
    color: "var(--tag-cyan-text)",
    borderColor: "var(--tag-cyan-border)",
  },

  // GEEKBLUE - azul brillante
  geekblue: {
    backgroundColor: "var(--tag-geekblue-bg)",
    color: "var(--tag-geekblue-text)",
    borderColor: "var(--tag-geekblue-border)",
  },

  volcano: {
    backgroundColor: "var(--tag-volcano-bg)",
    color: "var(--tag-volcano-text)",
    borderColor: "var(--tag-volcano-border)",
  },

  // LIME - verde limón vibrante
  lime: {
    backgroundColor: "var(--tag-lime-bg)",
    color: "var(--tag-lime-text)",
    borderColor: "var(--tag-lime-border)",
  },

  // MAGENTA - magenta/rosa vibrante
  magenta: {
    backgroundColor: "var(--tag-magenta-bg)",
    color: "var(--tag-magenta-text)",
    borderColor: "var(--tag-magenta-border)",
  },

  // GOLD - dorado vibrante para que sea importante y resalte tipo dorado
  gold: {
    backgroundColor: "var(--tag-gold-bg)",
    color: "var(--tag-gold-text)",
    borderColor: "var(--tag-gold-border)",
  },

  // BLUE - azul cielo vibrante
  blue: {
    backgroundColor: "var(--tag-blue-bg)",
    color: "var(--tag-blue-text)",
    borderColor: "var(--tag-blue-border)",
  },
};

export const AppTag = ({
  tone = "neutral",
  icon,
  style,
  className,
  ...props
}: AppTagProps) => {
  const toneStyles = TONE_STYLES[tone];

  return (
    <Tag
      icon={icon}
      className={className}
      style={{
        ...toneStyles,
        borderStyle: "solid",
        borderWidth: "1px",
        fontWeight: 600,
        marginInlineEnd: 0,
        borderRadius: "var(--radius-md)",
        padding: "1px 10px",
        fontSize: "12px",
        transition: "all var(--transition-base)",
        ...style,
      }}
      {...props}
    />
  );
};
