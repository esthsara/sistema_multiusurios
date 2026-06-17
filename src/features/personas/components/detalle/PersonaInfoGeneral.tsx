import { Card, Avatar, Button } from "antd";
import { User, Building2, ExternalLink } from "lucide-react";
import type { PersonaDetalle } from "../../types/persona.types";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import { getAvatarUrl } from "@/shared/utils/avatar";
interface PersonaInfoGeneralProps {
  persona: PersonaDetalle;
}

export const PersonaInfoGeneral = ({ persona }: PersonaInfoGeneralProps) => {
  const navigate = useNavigate();
  const isFisica = persona.tipo_persona === "FISICA";

  const nombreDisplay = isFisica
    ? `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim()
    : (persona.razon_social ?? "Sin nombre");

  const infoItems = isFisica
    ? [
        { label: "Nombre", value: persona.nombre ?? "—" },
        { label: "Apellido", value: persona.apellido ?? "—" },
        { label: "Identificación", value: persona.identificacion_principal },
        {
          label: "Fecha de nacimiento",
          value: persona.fecha_nacimiento ?? "—",
        },
        { label: "Género", value: persona.genero ?? "—" },
        { label: "Estado", value: persona.estado_texto ?? persona.estado },
      ]
    : [
        { label: "Razón Social", value: persona.razon_social ?? "—", span: 2 },
        { label: "Identificación", value: persona.identificacion_principal },
        { label: "Estado", value: persona.estado_texto ?? persona.estado },
      ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* PERFIL */}
      <Card
        className="relative overflow-hidden"
        style={{
          background: "var(--gradient-primary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        {/* overlay sutil fijo */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        <div className="flex flex-col items-center text-center gap-5 py-7 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30"
              style={{
                background:
                  "color-mix(in srgb, var(--color-primary-600) 40%, transparent)",
              }}
            />

            <Avatar
              size={88}
              src={getAvatarUrl(persona)}
              icon={isFisica ? <User size={36} /> : <Building2 size={36} />}
              style={{
                backgroundColor: "var(--color-primary-600)",
                border: "2px solid var(--color-primary-400)",
              }}
            />
          </div>

          {/* Nombre */}
          <div>
            <h3
              className="font-semibold text-lg tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {nombreDisplay}
            </h3>
          </div>

          {/* Estado + tipo */}
          <div className="flex gap-2 flex-wrap justify-center">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background:
                  persona.estado === "ACTIVO"
                    ? "var(--color-alert-success-bg)"
                    : "var(--color-alert-danger-bg)",
                color:
                  persona.estado === "ACTIVO"
                    ? "var(--color-success-500)"
                    : "var(--color-danger-500)",
              }}
            >
              {persona.estado_texto ?? persona.estado}
            </span>

            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "var(--color-alert-primary-bg)",
                color: "var(--color-primary-600)",
              }}
            >
              {persona.tipo_texto ?? persona.tipo_persona}
            </span>
          </div>

          {/* Cuenta */}
          {Boolean(persona.usuario) && (
            <div
              className="w-full mt-2 p-3 rounded-xl transition-colors duration-200 hover:bg-[var(--color-primary-200)]"
              style={{
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-[10px] font-semibold mb-2 tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                CUENTA RELACIONADA
              </p>

              <Button
                type="text"
                size="small"
                icon={<ExternalLink size={14} />}
                className="w-full flex justify-center items-center gap-2"
                style={{
                  color: "var(--color-primary-600)",
                  fontWeight: 500,
                }}
                onClick={() =>
                  navigate(APP_ROUTES.DASHBOARD.USUARIOS.DETALLE(persona.id))
                }
              >
                Ver Usuario
              </Button>
            </div>
          )}

          {/* Metadata */}
          <div
            className="w-full p-3 rounded-xl"
            style={{
              background:
                "color-mix(in srgb, var(--color-bg-overlay) 70%, transparent)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-[10px] font-semibold mb-2 tracking-wider"
              style={{ color: "var(--color-text-disabled)" }}
            >
              METADATA
            </p>

            <div className="space-y-1">
              {[
                { label: "created_at", value: persona.created_at },
                { label: "updated_at", value: persona.updated_at },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {label}
                  </span>
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* INFO */}
      <Card
        title="Información Personal"
        className="xl:col-span-2"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl transition-colors duration-200 hover:bg-[var(--color-bg-base-2)] ${
                item.span === 2 ? "sm:col-span-2" : ""
              }`}
              style={{
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.label}
              </p>

              {item.label === "Estado" ? (
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    background:
                      persona.estado === "ACTIVO"
                        ? "var(--color-alert-success-bg)"
                        : "var(--color-alert-danger-bg)",
                    color:
                      persona.estado === "ACTIVO"
                        ? "var(--color-success-500)"
                        : "var(--color-danger-500)",
                  }}
                >
                  {item.value}
                </span>
              ) : (
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
