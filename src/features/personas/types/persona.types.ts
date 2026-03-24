// src/features/personas/types/persona.types.ts
import type { TipoPersona, EstadoPersona } from '@/shared/types/auth.types'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESPUESTAS DEL BACKEND */

export interface PersonaListItem {
  id:                       number
  foto:                     string | null
  nombre:                   string | null
  apellido:                 string | null
  razon_social:             string | null
  nombre_completo:          string | null
  display_name:             string
  identificacion_principal: string
  tipo_persona:             TipoPersona
  tipo_texto:               string
  estado:                   EstadoPersona
  estado_texto:             string
  estado_color:             string
  fecha_registro:           string
  fecha_registro_humano:    string
  usuario_asociado: {
    id:       number
    username: string
    email:    string
  } | null
}

export interface PersonaDetalle {
  id:                       number
  tipo_persona:             TipoPersona
  tipo_texto:               string
  identificacion_principal: string
  fecha_nacimiento:         string | null
  genero:                   string | null
  foto:                     string | null
  foto_path:                string | null
  estado:                   EstadoPersona
  estado_texto:             string
  created_at:               string
  updated_at:               string
  usuario:                  unknown | null
  contactos:                unknown[]
  domicilios:               unknown[]
  archivos:                 unknown[]
  // FISICA
  nombre?:                  string | null
  apellido?:                string | null
  nombre_completo?:         string | null
  // MORAL
  razon_social?:            string | null
}

/*Sara revisa podriamos herdedar de aithtypes  */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DTOs — Lo que enviamos */

export interface CreatePersonaFisicaDto {
  tipo_persona:             'FISICA'
  nombre:                   string
  apellido:                 string
  identificacion_principal: string
  fecha_nacimiento?:        string
  genero?:                  'M' | 'F' | 'Otro'
}

export interface CreatePersonaMoralDto {
  tipo_persona:             'MORAL'
  razon_social:             string
  identificacion_principal: string
}


export type CreatePersonaDto = CreatePersonaFisicaDto | CreatePersonaMoralDto


export type UpdatePersonaDto = Partial<
  Omit<CreatePersonaFisicaDto, "tipo_persona"> &
    Omit<CreatePersonaMoralDto, "tipo_persona">
>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FILTROS DE TABLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface PersonaFilters {
  tipo_persona?: TipoPersona | ''
  estado?:       EstadoPersona | ''
  fecha_desde?:  string
  fecha_hasta?:  string
}

// src/features/personas/types/persona.types.ts

// src/features/personas/types/persona.types.ts

export interface PersonaQueryParams extends PersonaFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  
  [key: string]: any; 
}