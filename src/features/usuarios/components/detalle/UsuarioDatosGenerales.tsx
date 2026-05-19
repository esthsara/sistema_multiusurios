// src/features/usuarios/components/detalle/UsuarioDatosGenerales.tsx
import { Avatar, Card, Button } from "antd";
import { User, Monitor, Smartphone, LogOut, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { Can } from "@/shared/components/guards/Can";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { UsuarioDetalle } from "../../types/usuario.types";

interface Props {
  usuario: UsuarioDetalle;
  onToggleBloqueo: () => void;
  onCerrarSesiones: () => void;
  onResetPassword: () => void;
}

const getDeviceIcon = (d: string) =>
  d.toLowerCase().includes("mobile") ? (
    <Smartphone size={14} />
  ) : (
    <Monitor size={14} />
  );

export const UsuarioDatosGenerales = ({ usuario, onCerrarSesiones }: Props) => {
  const navigate = useNavigate();

  const nombre =
    usuario.persona.razon_social ??
    `${usuario.persona.nombre ?? ""} ${usuario.persona.apellido ?? ""}`.trim();

  const initials = nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const ultimaIp = usuario.sesiones_activas?.[0]?.ip;
  const sesionActual = usuario.sesiones_activas?.find((s) => s.es_actual);

  return (
    <div className="space-y-4">
      {/* ───── GRID ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ───── PERFIL ───── */}
        <Card
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <div className="flex flex-col items-center text-center gap-4 py-2">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                size={80}
                src={usuario.persona.foto ?? undefined}
                icon={<User size={32} />}
                style={{
                  backgroundColor: "var(--color-primary-600)",
                }}
              >
                {initials}
              </Avatar>

              {/* Estado */}
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                style={{
                  borderColor: "var(--color-bg-base)",
                  backgroundColor: usuario.activo
                    ? "var(--color-success-500)"
                    : "var(--color-border)",
                }}
              />
            </div>

            {/* Info */}
            <div>
              <h3
                className="font-semibold text-lg m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                {usuario.username}
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {usuario.email}
              </p>
            </div>

            {/* Estado */}
            <AppTag tone={usuario.activo ? "success" : "danger"}>
              {usuario.activo ? "Activo" : "Bloqueado"}
            </AppTag>
          </div>
        </Card>

        {/* ───── ACTIVIDAD ───── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* ───── PERSONA (MINIMAL) ───── */}
          <Card
            title="Persona asociada"
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium m-0">{nombre}</p>
                <AppTag
                  tone={
                    usuario.persona.tipo_persona === "FISICA"
                      ? "blue"
                      : "purple"
                  }
                  style={{ marginTop: 6 }}
                >
                  {usuario.persona.tipo_texto}
                </AppTag>
              </div>

              <Button
                type="text"
                size="small"
                icon={<ExternalLink size={14} />}
                className="flex items-center gap-2"
                style={{
                  color: "var(--color-primary-600)",
                  fontWeight: 500,
                }}
                onClick={() =>
                  navigate(
                    APP_ROUTES.DASHBOARD.PERSONAS.DETALLE(usuario.persona.id),
                  )
                }
              >
                Ver Persona
              </Button>
            </div>
          </Card>

          <Card
            title="Actividad y sesiones"
            extra={
              <Can permission="usuarios.editar">
                <Button
                  danger
                  size="small"
                  icon={<LogOut size={14} />}
                  onClick={onCerrarSesiones}
                  className="rounded-lg font-medium"
                  style={{
                    color: "var(--color-danger-600)",
                  }}
                >
                  Cerrar sesiones
                </Button>
              </Can>
            }
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            {/* IP */}
            {ultimaIp && (
              <div className="mb-3 text-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Última IP:
                </span>{" "}
                <span style={{ fontWeight: 500 }}>{ultimaIp}</span>
                {sesionActual?.es_actual && (
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-alert-success-bg)",
                      color: "var(--color-success-500)",
                    }}
                  >
                    En línea
                  </span>
                )}
              </div>
            )}

            {/* Sesiones */}
            <div className="space-y-2">
              {usuario.sesiones_activas?.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(s.dispositivo)}

                    <div>
                      <p className="text-sm m-0">{s.dispositivo}</p>
                      <p
                        className="text-xs m-0"
                        style={{
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {s.ip} · {s.ultima_actividad}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: s.es_actual
                        ? "var(--color-alert-success-bg)"
                        : "var(--color-bg-subtle)",
                      color: s.es_actual
                        ? "var(--color-success-500)"
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {s.es_actual ? "En línea" : "Inactivo"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
