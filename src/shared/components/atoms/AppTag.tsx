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
  | "volcano";

interface AppTagProps extends Omit<TagProps, "color"> {
  tone?: AppTagTone;
  icon?: ReactNode;
}

const TONE_STYLES: Record<
  AppTagTone,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  neutral: {
    backgroundColor: "var(--color-bg-subtle)",
    color: "var(--color-text-secondary)",
    borderColor: "var(--color-border)",
  },

  primary: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    color: "rgb(96, 165, 250)",
    borderColor: "rgba(59, 130, 246, 0.35)",
  },

  success: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    color: "rgb(74, 222, 128)",
    borderColor: "rgba(34, 197, 94, 0.35)",
  },

  warning: {
    backgroundColor: "rgba(234, 179, 8, 0.18)",
    color: "rgb(253, 224, 71)",
    borderColor: "rgba(234, 179, 8, 0.35)",
  },

  danger: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "rgb(252, 165, 165)",
    borderColor: "rgba(239, 68, 68, 0.35)",
  },

  purple: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    color: "rgb(196, 181, 253)",
    borderColor: "rgba(168, 85, 247, 0.35)",
  },

  cyan: {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    color: "rgb(103, 232, 249)",
    borderColor: "rgba(6, 182, 212, 0.35)",
  },

  geekblue: {
    backgroundColor: "rgba(59, 130, 246, 0.18)",
    color: "rgb(147, 197, 253)",
    borderColor: "rgba(59, 130, 246, 0.4)",
  },

  volcano: {
    backgroundColor: "rgba(249, 115, 22, 0.18)",
    color: "rgb(253, 186, 116)",
    borderColor: "rgba(249, 115, 22, 0.4)",
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
        borderWidth: 1,
        fontWeight: 600,
        marginInlineEnd: 0,
        ...style,
      }}
      {...props}
    />
  );
};
