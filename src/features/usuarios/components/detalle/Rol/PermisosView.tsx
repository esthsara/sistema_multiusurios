import { Flex, Typography, Tooltip } from "antd";
import { CheckCircle2, XCircle } from "lucide-react";
import { AppTag } from "@/shared/components/atoms/AppTag";
import {
  formatPermiso,
  agruparPermisosPorModulo,
  obtenerTonePermiso,
} from "./rol.constants";

const { Text } = Typography;

interface PermisosViewProps {
  permisos: string[];
}

export const PermisosView = ({ permisos }: PermisosViewProps) => {
  const permisosAgrupados = agruparPermisosPorModulo(permisos);
  const modulos = Object.keys(permisosAgrupados).sort();

  if (modulos.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <Text style={{ color: "var(--color-text-secondary)" }}>
          Sin permisos asignados
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 16,
      }}
    >
      {modulos.map((modulo) => {
        const permisosModulo = permisosAgrupados[modulo];
        const tieneAltoImpacto = permisosModulo.some((p) =>
          ["eliminar", "eliminar_permanente", "exportar"].some((a) =>
            p.endsWith(`.${a}`),
          ),
        );

        return (
          <div
            key={modulo}
            style={{
              borderRadius: "var(--radius-md)",
              padding: 16,
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Header del módulo */}
            <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
              <span
                style={{
                  textTransform: "capitalize",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                {modulo}
              </span>
              <AppTag
                tone="neutral"
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                }}
              >
                {permisosModulo.length}
              </AppTag>
              {tieneAltoImpacto && (
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-alert-danger-bg)",
                    color: "var(--color-danger-500)",
                    fontWeight: 600,
                  }}
                >
                  Alto Impacto
                </span>
              )}
            </Flex>

            {/* Permisos del módulo */}
            <Flex wrap="wrap" gap={6} vertical>
              {permisosModulo.map((permiso) => {
                const { accion } = formatPermiso(permiso);
                const tone = obtenerTonePermiso(permiso);

                return (
                  <Tooltip key={permiso} title={permiso}>
                    <AppTag
                      tone={tone}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        cursor: "default",
                        textTransform: "capitalize",
                      }}
                      icon={
                        tone === "success" ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <XCircle size={10} />
                        )
                      }
                    >
                      {accion}
                    </AppTag>
                  </Tooltip>
                );
              })}
            </Flex>
          </div>
        );
      })}
    </div>
  );
};
