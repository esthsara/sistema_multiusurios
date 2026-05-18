import { http } from "@/shared/services/http.service";
import type { SessionItem } from "../types/sessions.types";

export const sessionsService = {
  /** Get all sessions */
  getAll: () => {
    console.log("[SessionsService] Fetching sessions...");
    return http.get<SessionItem[]>("/auth/sessions");
  },

  /** Revoke all sessions (server endpoint returns sessions_revoked) */
  revokeAll: () => {
    console.log("[SessionsService] Revoking all sessions...");
    return http.post<{ sessions_revoked: number }, void>(
      "/auth/sessions/revoke",
      undefined,
    );
  },
};

export default sessionsService;
