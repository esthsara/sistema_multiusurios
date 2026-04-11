// src/features/auth/services/auth.service.ts
import apiClient from "@/config/axios.config";
import { handleHttpError } from "@/shared/utils/error.handler";
import type {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  BackendUser,
  AccessTokenObject,
} from "@/shared/types/auth.types";
import type { ApiResponse } from "@/shared/types/api.types";

/* ── Tipos de respuesta crudos del backend  ── */

interface LoginResponseData {
  user: BackendUser;
  access_token: AccessTokenObject; // Login siempre devuelve objeto
  token_type: string;
  sucursal_actual: unknown | null;
  session_id: number;
}

interface RegisterResponseData {
  user: BackendUser;
  access_token: string; // Register devuelve string
  token_type: string;
  sucursal_asignada: unknown | null;
  session_id: number;
}

interface MeResponseData extends BackendUser {}

interface UserBranchItem {
  id: number;
  nombre: string;
  codigo?: string;
  clave?: string;
  es_actual?: boolean;
}

interface UserBranchesResponseData {
  total: number;
  items: UserBranchItem[];
  sucursal_actual: number | null;
}

interface SwitchBranchResponseData {
  sucursal_anterior?: UserBranchItem | null;
  sucursal_actual?: UserBranchItem | null;
  mensaje?: string;
}

export const authService = {
  login: async (dto: LoginDto) => {
    try {
      const res = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  register: async (dto: RegisterDto) => {
    try {
      const res = await apiClient.post<ApiResponse<RegisterResponseData>>(
        "/auth/register",
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  me: async () => {
    try {
      const res = await apiClient.get<ApiResponse<MeResponseData>>("/auth/me");
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  getUserBranches: async () => {
    try {
      const res =
        await apiClient.get<ApiResponse<UserBranchesResponseData>>(
          "/users/branches",
        );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  switchBranch: async (sucursalId: number) => {
    try {
      const res = await apiClient.put<ApiResponse<SwitchBranchResponseData>>(
        `/users/switch-branch/${sucursalId}`,
        { sucursal_id: sucursalId },
      );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  logout: async () => {
    try {
      const res = await apiClient.post<ApiResponse<void>>("/auth/logout");
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  getSessions: async () => {
    try {
      const res = await apiClient.get<ApiResponse<unknown[]>>("/auth/sessions");
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  closeSession: async (sessionId: number) => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>(
        `/auth/sessions/${sessionId}`,
      );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  closeAllSessions: async () => {
    try {
      const res = await apiClient.delete<ApiResponse<void>>("/auth/sessions");
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },

  changePassword: async (dto: ChangePasswordDto) => {
    try {
      const res = await apiClient.post<ApiResponse<void>>(
        "/auth/change-password",
        dto,
      );
      return res.data;
    } catch (error) {
      throw handleHttpError(error, true);
    }
  },
};
