// src/features/usuarios/components/detalle/UsuarioSecciones.tsx
import { Card } from "antd";
import type { UsuarioDetalle } from "../../types/usuario.types";

interface UsuarioSeccionesProps {
  usuario: UsuarioDetalle;
}

/**
 * Agrupa los permisos por módulo para mostrarlos
 * de forma organizada por sección.
 */
const agruparPermisosPorModulo = (
  permisos: string[],
): Record<string, string[]> => {
  return permisos.reduce<Record<string, string[]>>((acc, permiso) => {
    const [modulo] = permiso.split(".");
    if (!acc[modulo]) acc[modulo] = [];
    acc[modulo].push(permiso);
    return acc;
  }, {});
};

const MODULO_LABELS: Record<string, string> = {
  personas: "Personas",
  usuarios: "Usuarios",
  sucursales: "Sucursales",
  roles: "Roles",
  permisos: "Permisos",
  auditoria: "Auditoría",
  dashboard: "Dashboard",
  reportes: "Reportes",
  archivos: "Archivos",
  contactos: "Contactos",
  domicilios: "Domicilios",
  asignaciones: "Asignaciones",
};

const ACCION_COLORS: Record<string, string> = {
  ver: "var(--color-alert-primary-bg)",
  crear: "var(--color-alert-success-bg)",
  editar: "var(--color-alert-warning-bg)",
  eliminar: "var(--color-alert-danger-bg)",
  eliminar_permanente: "var(--color-alert-danger-bg)",
  exportar: "var(--color-alert-primary-bg)",
  asignar: "var(--color-alert-success-bg)",
  quitar: "var(--color-alert-danger-bg)",
  ver_sucursal: "var(--color-alert-primary-bg)",
  subir: "var(--color-alert-success-bg)",
};

const ACCION_TEXT_COLORS: Record<string, string> = {
  ver: "var(--color-primary-600)",
  crear: "var(--color-success-600)",
  editar: "var(--color-warning-600)",
  eliminar: "var(--color-danger-600)",
  eliminar_permanente: "var(--color-danger-600)",
  exportar: "var(--color-primary-600)",
  asignar: "var(--color-success-600)",
  quitar: "var(--color-danger-600)",
  ver_sucursal: "var(--color-primary-600)",
  subir: "var(--color-success-600)",
};

export const UsuarioSecciones = ({ usuario }: UsuarioSeccionesProps) => {
  const permisosPorModulo = agruparPermisosPorModulo(usuario.permisos);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Permisos por Sección
        </h3>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {usuario.permisos.length} permisos en total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Object.entries(permisosPorModulo).map(([modulo, permisos]) => (
          <Card
            key={modulo}
            size="small"
            title={
              <span
                className="text-sm font-semibold capitalize"
                style={{ color: "var(--color-text-primary)" }}
              >
                {MODULO_LABELS[modulo] ?? modulo}
              </span>
            }
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            <div className="flex flex-wrap gap-1.5">
              {permisos.map((permiso) => {
                const accion = permiso.split(".")[1] ?? "";
                return (
                  <span
                    key={permiso}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        ACCION_COLORS[accion] ?? "rgba(100,116,139,0.1)",
                      color:
                        ACCION_TEXT_COLORS[accion] ??
                        "var(--color-text-secondary)",
                      border: `1px solid ${ACCION_COLORS[accion] ?? "rgba(100,116,139,0.2)"}`,
                    }}
                  >
                    {accion}
                  </span>
                );
              })}
            </div>
          </Card>
        ))}

        {Object.keys(permisosPorModulo).length === 0 && (
          <p
            className="text-sm col-span-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Este usuario no tiene permisos asignados
          </p>
        )}
      </div>
    </div>
  );
};
