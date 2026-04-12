// src/features/usuarios/components/detalle/UsuarioDatosGenerales.tsx
import { Avatar, Badge, Card, Descriptions, Tag, Button, Tooltip } from "antd";
import {
  User,
  Monitor,
  Smartphone,
  MapPin,
  LogOut,
  Shield,
  ShieldOff,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Can } from "@/shared/components/atoms/Can";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { UsuarioDetalle } from "../../types/usuario.types";

interface UsuarioDatosGeneralesProps {
  usuario: UsuarioDetalle;
  onToggleBloqueo: () => void;
  onCerrarSesiones: () => void;
  onResetPassword: () => void;
}

const getDeviceIcon = (dispositivo: string) => {
  const d = dispositivo.toLowerCase();
  if (d.includes("mobile") || d.includes("iphone") || d.includes("android")) {
    return <Smartphone size={14} />;
  }
  return <Monitor size={14} />;
};

export const UsuarioDatosGenerales = ({
  usuario,
  onToggleBloqueo,
  onCerrarSesiones,
  onResetPassword,
}: UsuarioDatosGeneralesProps) => {
  const navigate = useNavigate();

  const nombreCompleto =
    (usuario.persona.razon_social ??
      `${usuario.persona.nombre ?? ""} ${usuario.persona.apellido ?? ""}`.trim()) ||
    "Sin nombre";

  const initials = nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  /* Última IP de las sesiones activas */
  const ultimaIp = usuario.sesiones_activas?.[0]?.ip ?? null;
  const sesionActual = usuario.sesiones_activas?.find((s) => s.es_actual);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ── Columna izquierda — Perfil ── */}
      <Card
        bodyStyle={{ padding: 20 }}
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "0 6px 20px rgba(2, 6, 23, 0.04)",
        }}
      >
        <div className="flex flex-col items-center text-center gap-4 py-1">
          {/* Avatar */}
          <div
            className="relative rounded-2xl p-3"
            style={{
              background: "var(--gradient-primary)",
            }}
          >
            <Avatar
              size={84}
              src={usuario.persona.foto ?? undefined}
              icon={<User size={36} />}
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              {initials}
            </Avatar>
            {/* Indicador activo */}
            <span
              className="absolute bottom-0 right-0 w-4 h-4
                         rounded-full border-2 border-white"
              style={{
                backgroundColor: usuario.activo
                  ? "var(--color-success-500)"
                  : "var(--color-danger-500)",
              }}
            />
          </div>

          <div>
            <h3
              className="font-bold text-lg m-0 tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {usuario.username}
            </h3>
            <p
              className="text-sm m-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {usuario.email}
            </p>
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              <Badge
                status={usuario.activo ? "success" : "error"}
                text={usuario.activo ? "Activo" : "Bloqueado"}
              />
              {usuario.roles[0] && (
                <Tag color="blue" className="rounded-full px-3 py-0.5">
                  {usuario.roles[0]}
                </Tag>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div
            className="w-full text-left p-3 rounded-xl"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            {[
              { label: "ID", value: `#${usuario.id}` },
              { label: "Registro", value: usuario.created_at.slice(0, 10) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {label}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div className="w-full flex flex-col gap-2 pt-1">
            <Button
              size="small"
              icon={<User size={13} />}
              block
              className="h-8 rounded-lg"
              style={{ borderColor: "var(--color-border)", fontWeight: 500 }}
              onClick={() =>
                navigate(
                  APP_ROUTES.DASHBOARD.PERSONAS.DETALLE(usuario.persona.id),
                )
              }
            >
              Ver Persona
            </Button>

            <Can permission="usuarios.editar">
              <Button
                size="small"
                danger={usuario.activo}
                icon={
                  usuario.activo ? (
                    <ShieldOff size={13} />
                  ) : (
                    <Shield size={13} />
                  )
                }
                block
                className="h-8 rounded-lg"
                style={{ fontWeight: 500 }}
                onClick={onToggleBloqueo}
              >
                {usuario.activo ? "Bloquear Usuario" : "Desbloquear Usuario"}
              </Button>
            </Can>

            <Can permission="usuarios.editar">
              <Button
                size="small"
                icon={<KeyRound size={13} />}
                block
                className="h-8 rounded-lg"
                style={{ borderColor: "var(--color-border)", fontWeight: 500 }}
                onClick={onResetPassword}
              >
                Reiniciar Contraseña
              </Button>
            </Can>
          </div>
        </div>
      </Card>

      {/* ── Columna derecha — 2 cards ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Seguridad de Cuenta */}
        <Card
          title="Seguridad de Cuenta"
          bodyStyle={{ paddingTop: 14 }}
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            boxShadow: "0 6px 20px rgba(2, 6, 23, 0.04)",
          }}
        >
          {/* Última IP */}
          {ultimaIp && (
            <div
              className="mb-4 p-3 rounded-xl"
              style={{
                backgroundColor: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-xs font-semibold mb-2 m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                ÚLTIMA IP DE ACCESO
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-success-500)" }}
                />
                <MapPin
                  size={13}
                  style={{ color: "var(--color-primary-500)" }}
                />
                <Tooltip title="Última IP registrada">
                  <span
                    className="text-sm font-mono"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {ultimaIp}
                  </span>
                </Tooltip>
                {sesionActual?.es_actual && (
                  <Tag color="green" className="text-xs rounded-full">
                    Sesión actual activa
                  </Tag>
                )}
              </div>
            </div>
          )}

          {/* Dispositivos vinculados */}
          {usuario.sesiones_activas?.length > 0 && (
            <div className="mb-4">
              <p
                className="text-xs font-semibold mb-2 m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                DISPOSITIVOS VINCULADOS
              </p>
              <div className="flex flex-col gap-2">
                {usuario.sesiones_activas.map((sesion) => (
                  <div
                    key={sesion.id}
                    className="flex items-center justify-between p-2.5 rounded-xl"
                    style={{
                      backgroundColor: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(sesion.dispositivo)}
                      <div>
                        <p
                          className="text-sm font-medium m-0"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {sesion.dispositivo}
                          {sesion.es_actual && (
                            <Tag color="green" className="ml-2 text-xs">
                              Actual
                            </Tag>
                          )}
                        </p>
                        <p
                          className="text-xs m-0"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {sesion.ip} · {sesion.ultima_actividad}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cerrar todas las sesiones */}
          <Can permission="usuarios.editar">
            <Button
              danger
              size="middle"
              icon={<LogOut size={13} />}
              onClick={onCerrarSesiones}
              className="mt-2 h-9 rounded-lg"
              style={{ fontWeight: 600 }}
            >
              Cerrar Sesión en todos los dispositivos
            </Button>
          </Can>
        </Card>

        {/* Información de Persona Asociada */}
        <Card
          title="Información de persona Asociada"
          extra={usuario.roles[0] && <Tag color="blue">{usuario.roles[0]}</Tag>}
          bodyStyle={{ paddingTop: 14 }}
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            boxShadow: "0 6px 20px rgba(2, 6, 23, 0.04)",
          }}
        >
          <Descriptions
            column={2}
            size="small"
            labelStyle={{
              color: "var(--color-text-secondary)",
              fontSize: 12,
              fontWeight: 600,
            }}
            contentStyle={{
              color: "var(--color-text-primary)",
              fontWeight: 500,
            }}
          >
            <Descriptions.Item label="Nombre Completo">
              {nombreCompleto}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">
              {usuario.persona.tipo_texto}
            </Descriptions.Item>
            {usuario.persona.tipo_persona === "FISICA" && (
              <>
                <Descriptions.Item label="Fecha de Nacimiento">
                  {usuario.persona.fecha_nacimiento ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Género">
                  {usuario.persona.genero ?? "—"}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Identificación">
              {usuario.persona.identificacion_principal}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Badge
                status={
                  usuario.persona.estado === "ACTIVO" ? "success" : "error"
                }
                text={usuario.persona.estado_texto}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};
