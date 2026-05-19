import { Modal, Button, ConfigProvider, theme } from "antd";
import { Home, Calendar, CheckCircle2 } from "lucide-react";
import type { Domicilio } from "./domicilio.constants";
import { AppTag } from "@/shared/components/atoms/AppTag";

interface Props {
  open: boolean;
  item: Domicilio | null;
  onClose: () => void;
}

export const DomicilioViewModal = ({ open, item, onClose }: Props) => {
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
        width={400}
        destroyOnHidden
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }}
      >
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
              <Home size={16} className="text-blue-400" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Detalle del domicilio
              </h3>
              <p
                className="text-xs m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Información registrada en el sistema
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/50">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Tipo
              </span>
              <AppTag
                className="m-0 px-3 py-0.5 rounded-full font-semibold"
                tone="cyan"
              >
                {item.tipo_texto}
              </AppTag>
            </div>

            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <span
                className="text-xs block mb-1 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Dirección completa
              </span>
              <span
                className="text-base font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.direccion}
              </span>
              <p
                className="text-sm m-0 mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.ciudad}, {item.pais}
                {item.codigo_postal ? ` · CP ${item.codigo_postal}` : ""}
              </p>
            </div>

            {item.principal && (
              <div className="flex items-center gap-2 px-1">
                <CheckCircle2 size={12} className="text-green-400" />
                <span
                  className="text-[11px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Este domicilio está marcado como principal
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-1">
              <Calendar
                size={12}
                style={{ color: "var(--color-text-secondary)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Registrado el: {item.created_at}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <Button
              block
              onClick={onClose}
              className="rounded-lg h-10 font-medium"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
