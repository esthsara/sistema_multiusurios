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
  ver: "rgba(59,130,246,0.1)",
  crear: "rgba(34,197,94,0.1)",
  editar: "rgba(234,179,8,0.1)",
  eliminar: "rgba(239,68,68,0.1)",
  eliminar_permanente: "rgba(239,68,68,0.15)",
  exportar: "rgba(168,85,247,0.1)",
  asignar: "rgba(34,197,94,0.1)",
  quitar: "rgba(239,68,68,0.1)",
  ver_sucursal: "rgba(59,130,246,0.1)",
  subir: "rgba(34,197,94,0.1)",
};

const ACCION_TEXT_COLORS: Record<string, string> = {
  ver: "#3b82f6",
  crear: "#16a34a",
  editar: "#ca8a04",
  eliminar: "#dc2626",
  eliminar_permanente: "#dc2626",
  exportar: "#9333ea",
  asignar: "#16a34a",
  quitar: "#dc2626",
  ver_sucursal: "#3b82f6",
  subir: "#16a34a",
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
