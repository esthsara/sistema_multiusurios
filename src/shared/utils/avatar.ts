export type MinimalPersona = {
  tipo_persona?: string | null;
  genero?: string | null;
  [key: string]: any;
};

export type MinimalUser = {
  roles?: Array<{ name: string } | string>;
  persona?: MinimalPersona;
  roles_detalle?: Array<{ name: string }>;
  [key: string]: any;
};

export const getAvatarUrl = (data?: MinimalUser | MinimalPersona | null): string => {
  const defaultAvatar = "/image/profile/avatar_6.jpg";
  if (!data) return defaultAvatar;

  // Helper para chequeo de rol case-insensitive
  const checkRole = (roleName: string) => {
    const r = roleName.trim().toLowerCase();
    return r === 'super admin' || r === 'super_admin';
  };

  // Determinar si 'data' es de tipo User
  const isUser = 'roles' in data || 'roles_detalle' in data || ('persona' in data && typeof data.persona === 'object');
  
  if (isUser) {
    const user = data as MinimalUser;
    
    // Check SUPER_ADMIN
    let isSuperAdmin = false;
    
    if (user.roles_detalle && Array.isArray(user.roles_detalle)) {
      isSuperAdmin = user.roles_detalle.some(r => checkRole(r.name));
    }
    
    if (!isSuperAdmin && user.roles && Array.isArray(user.roles)) {
      isSuperAdmin = user.roles.some((r) => {
        if (typeof r === 'string') return checkRole(r);
        return checkRole(r?.name || '');
      });
    }

    if (isSuperAdmin) {
      return "/image/profile/avatar_4.jpg";
    }

    if (user.persona) {
      return getAvatarUrl(user.persona);
    }
    return defaultAvatar;
  }


  const persona = data as MinimalPersona;
  
  if (persona.tipo_persona === "MORAL") {
    return "/image/profile/avatar_3.jpg";
  }

  if (persona.tipo_persona === "FISICA") {
    const genero = persona.genero?.trim().toUpperCase();
    if (genero === "F" || genero === "FEMENINO") {
      return "/image/profile/avatar_1.jpg";
    }
    if (genero === "M" || genero === "MASCULINO") {
      return "/image/profile/avatar_2.jpg";
    }
  }

  return defaultAvatar;
};

