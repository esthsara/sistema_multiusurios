/* ── Tipos de respuesta crudos del backend  ── */
import type {
  BackendUser,
  AccessTokenObject,
} from "@/shared/types/auth.types";

export interface LoginResponseData {
  user: BackendUser;
  access_token: AccessTokenObject; // Login siempre devuelve objeto
  token_type: string;
  sucursal_actual: unknown | null;
  session_id: number;
}

export interface RegisterResponseData {
  user: BackendUser;
  access_token: string; // Register devuelve string
  token_type: string;
  sucursal_asignada: unknown | null;
  session_id: number;
}

export interface MeResponseData extends BackendUser {}

export interface UserBranchItem {
  id: number;
  nombre: string;
  codigo?: string;
  clave?: string;
  es_actual?: boolean;
  activa?: boolean;
}

export interface UserBranchesResponseData {
  total: number;
  items: UserBranchItem[];
  sucursal_actual: number | null;
}

export interface SwitchBranchResponseData {
  sucursal_anterior?: UserBranchItem | null;
  sucursal_actual?: UserBranchItem | null;
  mensaje?: string;
}