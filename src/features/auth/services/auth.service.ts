// src/features/auth/services/auth.service.ts
import { http } from "@/shared/services/http.service";
import type {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
} from "@/shared/types/auth.types";
import type {
  LoginResponseData,
  RegisterResponseData,
  MeResponseData,
  UserBranchesResponseData,
  SwitchBranchResponseData,
} from "@/features/auth/types/auth.types";

export const authService = {
  login: (dto: LoginDto) =>
    http.post<LoginResponseData, LoginDto>("/auth/login", dto),

  register: (dto: RegisterDto) =>
    http.post<RegisterResponseData, RegisterDto>("/auth/register", dto),

  me: () => http.get<MeResponseData>("/auth/me"),

  getUserBranches: () =>
    http.get<UserBranchesResponseData>("/users/branches"),

  switchBranch: (sucursalId: number) =>
    http.put<SwitchBranchResponseData, { sucursal_id: number }>(
      `/users/switch-branch/${sucursalId}`,
      { sucursal_id: sucursalId }
    ),

  logout: () => http.post<void, Record<string, never>>("/auth/logout", {}),

  changePassword: (dto: ChangePasswordDto) =>
    http.post<void, ChangePasswordDto>("/auth/change-password", dto),
};
