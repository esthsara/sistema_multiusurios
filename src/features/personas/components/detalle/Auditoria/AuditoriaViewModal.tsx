import { Modal, Button, ConfigProvider, Grid, theme } from "antd";
import { User, Globe, Calendar } from "lucide-react";

import { AppTag } from "@/shared/components/atoms/AppTag";

import { ACCION_TONE, type AuditoriaItem } from "./auditoria.constants";

interface Props {
  open: boolean;
  item: AuditoriaItem | null;
  onClose: () => void;
}

export const AuditoriaViewModal = ({ open, item, onClose }: Props) => {
  const screens = Grid.useBreakpoint();

  if (!item) return null;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorBgElevated: "var(--color-bg-base)" },
      }}
    >
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={screens.sm ? 460 : "92%"}
        destroyOnHidden
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }}
      >
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
              <User size={16} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Detalle de auditoría
              </h3>
              <p
                className="text-xs m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Registro del sistema
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded-lg border bg-[var(--color-bg-subtle)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Acción
            </span>
            <div className="mt-1">
              <AppTag tone={ACCION_TONE[item.accion] ?? "neutral"}>
                {item.accion_texto}
              </AppTag>
            </div>
          </div>

          <div
            className="p-3 rounded-lg border bg-[var(--color-bg-subtle)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Usuario
            </span>
            <p
              className="m-0 font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.usuario.nombre}
            </p>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.usuario.email}
            </span>
          </div>

          <div
            className="p-3 rounded-lg border bg-[var(--color-bg-subtle)]"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Entidad
            </span>
            <p className="m-0" style={{ color: "var(--color-text-primary)" }}>
              {item.entidad_nombre}
            </p>
          </div>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Globe size={12} />
            {item.ip ?? "Sin IP"}
          </div>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Calendar size={12} />
            {item.fecha} ({item.created_at_humano})
          </div>

          <Button
            block
            onClick={onClose}
            className="rounded-lg h-10 font-medium"
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
