// src/shared/components/atoms/Can.tsx
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { PermissionString } from "@/shared/types/auth.types";

/**
 * CanOperator — AND requiere todos, OR requiere al menos uno.
 */
type CanOperator = "AND" | "OR";

interface CanProps {
  /** Un permiso o array de permisos */
  permission: PermissionString | PermissionString[];
  /** AND (default) → necesita todos | OR → necesita al menos uno */
  operator?: CanOperator;
  /** Qué renderizar si SÍ tiene permiso */
  children: React.ReactNode;
  /** Qué renderizar si NO tiene permiso (opcional) */
  fallback?: React.ReactNode;
}

/**
 * <Can /> — Componente declarativo de control de acceso.
 *
 * Uso básico:
 *   <Can permission="personas.crear">
 *     <Button>Nueva Persona</Button>
 *   </Can>
 *
 * Con múltiples permisos (OR):
 *   <Can permission={['personas.editar', 'personas.crear']} operator="OR">
 *     <Button>Editar</Button>
 *   </Can>
 *
 * Con fallback:
 *   <Can permission="personas.eliminar" fallback={<span>Sin acceso</span>}>
 *     <Button danger>Eliminar</Button>
 *   </Can>
 */
export const Can = ({
  permission,
  operator = "AND",
  children,
  fallback = null,
}: CanProps) => {
  const { can, canAll, canAny } = usePermissions();

  const permissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess =
    permissions.length === 1
      ? can(permissions[0])
      : operator === "AND"
        ? canAll(permissions)
        : canAny(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
