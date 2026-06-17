import type { ReactNode } from "react";

export type IconType = "poweroff" | "rotateccw" | "trash2";

export interface ConfirmConfig {
  title: string;
  description: string;
  confirmText: string;
  danger: boolean;
  icon?: ReactNode;
  iconType?: IconType;
  blockDelete?: boolean;
}
