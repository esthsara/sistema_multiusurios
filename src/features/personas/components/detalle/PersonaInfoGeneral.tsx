// src/features/personas/components/detalle/PersonaInfoGeneral.tsx
import { Card, Badge, Avatar, Tag, Button } from "antd";
import { User, Building2, ExternalLink } from "lucide-react";
import type { PersonaDetalle } from "../../types/persona.types";

interface PersonaInfoGeneralProps {
  persona: PersonaDetalle;
}

export const PersonaInfoGeneral = ({ persona }: PersonaInfoGeneralProps) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ── Tarjeta de perfil ── */}
      <Card
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <Avatar
            size={80}
            src={persona.foto}
            icon={isFisica ? <User size={36} /> : <Building2 size={36} />}
            style={{ backgroundColor: "var(--color-primary-600)" }}
          />
          <div>
            <h3
              className="font-bold text-lg m-0"
              style={{ color: "var(--color-text-primary)" }}
            >
              {nombreDisplay || "Sin nombre"}
            </h3>
            <p
              className="text-sm m-0 mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              ID: #{persona.id}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <Badge
              status={persona.estado === "ACTIVO" ? "success" : "error"}
              text={persona.estado_texto ?? persona.estado}
            />
            <Tag color={isFisica ? "blue" : "purple"}>
              {persona.tipo_texto ?? persona.tipo_persona}
            </Tag>
          </div>

          {/* Cuenta relacionada */}
          {Boolean(persona.usuario) && (
            <div
              className="w-full mt-2 p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-subtle)" }}
            >
              <p
                className="text-xs font-semibold m-0 mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                CUENTA RELACIONADA
              </p>
              <Button
                type="link"
                size="small"
                icon={<ExternalLink size={12} />}
                className="p-0 h-auto"
              >
                Ver Usuario
              </Button>
            </div>
          )}

          {/* Metadata */}
          <div
            className="w-full text-left mt-2 p-3 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-subtle)" }}
          >
            <p
              className="text-xs font-semibold mb-2 m-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              METADATA
            </p>
            {[
              { label: "created_at", value: persona.created_at },
              { label: "updated_at", value: persona.updated_at },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-0.5">
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
                  {value ?? "no registro"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Información personal ── */}
      <Card
        title={
          <span style={{ color: "var(--color-text-primary)" }}>
            Información Personal
          </span>
        }
        className="lg:col-span-2"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className={item.span === 2 ? "sm:col-span-2" : undefined}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
                backgroundColor:
                  "color-mix(in srgb, var(--color-bg-overlay) 50%, transparent)",
              }}
            >
              <p
                className="text-xs font-semibold m-0 mb-1"
                style={{
                  color: "var(--color-text-secondary)",
                  letterSpacing: 0.3,
                }}
              >
                {item.label}
              </p>

              {item.label === "Estado" ? (
                <Badge
                  status={persona.estado === "ACTIVO" ? "success" : "error"}
                  text={item.value}
                />
              ) : (
                <p
                  className="text-sm font-medium m-0"
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
