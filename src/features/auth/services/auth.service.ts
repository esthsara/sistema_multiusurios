// src/features/auth/services/auth.service.ts
import apiClient from "@/config/axios.config";
import { handleHttpError } from "@/shared/utils/error.handler";
import type {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,

} from "@/shared/types/auth.types";
import type { ApiResponse } from "@/shared/types/api.types";

import type {
  LoginResponseData,
  RegisterResponseData,
  MeResponseData,
  UserBranchesResponseData,
  SwitchBranchResponseData,
} from "../types/auth.types";

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
