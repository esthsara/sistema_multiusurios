// src/features/sucursales/components/detalle/SucursalInfoGeneral.tsx
import { Avatar, Card, Button } from "antd";
import {
  Building2,
  Mail,
  MapPin,
  Clock,
  Shield,
  ShieldOff,
  Users,
} from "lucide-react";
import { Can } from "@/shared/components/guards/Can";
import { getResolvedFileUrl } from "@/shared/utils/file-url.utils";
import type { SucursalDetalle } from "@/features/sucursales/types/sucursal.types";
import { AppTag } from "@/shared/components/atoms/AppTag";

interface Props {
  sucursal: SucursalDetalle;
  onToggleEstado?: () => void;
  onConfigurar?: () => void;
}

export const SucursalInfoGeneral = ({ sucursal, onToggleEstado }: Props) => {
  // Iniciales para el avatar en caso de que no haya logo
  const initials = sucursal.nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="space-y-4">
      {/* ───── GRID (1 col en móvil, 3 en LG) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ───── PERFIL / RESUMEN (OCUPA 1 COL) ───── */}
        <Card
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <div className="flex flex-col items-center text-center gap-4 py-2">
            {/* Avatar / Logo */}
            <div className="relative">
              <Avatar
                size={80}
                src={
                  sucursal.logo ? getResolvedFileUrl(sucursal.logo) : undefined
                }
                icon={<Building2 size={32} />}
                style={{
                  backgroundColor: "var(--color-primary-600)",
                }}
              >
                {initials}
              </Avatar>

              {/* Punto de estado indicador */}
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                style={{
                  borderColor: "var(--color-bg-base)",
                  backgroundColor: sucursal.activa
                    ? "var(--color-success-500)"
                    : "var(--color-border)",
                }}
              />
            </div>

            {/* Info Principal */}
            <div>
              <h3
                className="font-semibold text-lg m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                {sucursal.nombre}
              </h3>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {sucursal.codigo}
              </p>
            </div>

            {/* Badge de Estado */}
            <AppTag
              className="px-3 py-1 rounded-full text-xs font-medium"
              tone={sucursal.activa ? "success" : "neutral"}
            >
              {sucursal.activa ? "Sede Activa" : "Sede Inactiva"}
            </AppTag>

            {/* Acciones Rápidas */}
            <div className="w-full flex flex-col gap-2">
              <Can permission="sucursales.editar">
                <Button
                  block
                  icon={
                    sucursal.activa ? (
                      <ShieldOff size={14} />
                    ) : (
                      <Shield size={14} />
                    )
                  }
                  onClick={onToggleEstado}
                >
                  {sucursal.activa ? "Desactivar" : "Activar"}
                </Button>
              </Can>
            </div>
          </div>
        </Card>

        {/* ───── DETALLES Y OPERACIÓN (OCUPA 2 COLS EN LG) ───── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Información de contacto y ubicación */}
          <Card
            title="Información de la Sucursal"
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                <Mail className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0">
                    Email
                  </p>
                  <p className="text-sm font-medium m-0">{sucursal.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                <MapPin className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0">
                    Dirección
                  </p>
                  <p className="text-sm font-medium m-0">
                    {sucursal.direccion}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                <Clock className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0">
                    Horario
                  </p>
                  <p className="text-sm font-medium m-0">
                    {sucursal.horario_completo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                <Users className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0">
                    Personal
                  </p>
                  <p className="text-sm font-medium m-0">
                    {sucursal.usuarios_count} asignados
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Descripción / Notas */}
          <Card
            title="Descripción"
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            <div className="p-1">
              <p className="text-sm text-[var(--color-text-secondary)] italic m-0">
                "
                {sucursal.descripcion ||
                  "No hay una descripción registrada para esta sucursal."}
                "
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
