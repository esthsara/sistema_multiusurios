export interface SessionTokenable {
  id: number;
  persona_id?: number | null;
  email?: string;
  username?: string;
  current_branch_id?: number | null;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface SessionToken {
  id: number;
  tokenable_type: string;
  tokenable_id: number;
  name: string;
  abilities: string[];
  last_used_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
  tokenable?: SessionTokenable | null;
}

export interface SessionItem {
  id: number;
  dispositivo: string;
  ip: string | null;
  ultima_actividad: string;
  login_at: string; // raw timestamp from API
  es_actual: boolean;
  currentToken?: SessionToken | null;
  activa: boolean;
}

export interface SessionsFilters {
  search?: string;
  dispositivo?: string;
  activa?: string; // 'true' | 'false' | ''
  fecha_desde?: string;
  fecha_hasta?: string;
}
