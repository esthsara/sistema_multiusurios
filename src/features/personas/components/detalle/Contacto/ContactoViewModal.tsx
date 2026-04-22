import {
  Modal,
  Button,
  Tooltip,
  message,
  Tag,
  ConfigProvider,
  theme,
} from "antd";
import { Copy, Mail, Phone, Calendar, Info, Check } from "lucide-react";
import { useState } from "react";
import type { Contacto } from "../../detalle/Contacto/contacto.constants";

interface Props {
  open: boolean;
  item: Contacto | null;
  onClose: () => void;
}

export const ContactoViewModal = ({ open, item, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.valor);
    setCopied(true);
    message.success("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  // Seleccionar icono según el tipo
  const getIcon = () => {
    if (item.tipo === "EMAIL")
      return <Mail size={16} className="text-blue-400" />;
    if (item.tipo === "TELEFONO")
      return <Phone size={16} className="text-green-400" />;
    return <Info size={16} className="text-purple-400" />;
  };

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
        destroyOnClose
        maskStyle={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div className="pt-4">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
              {getIcon()}
            </div>
            <div>
              <h3
                className="text-lg font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Detalle del contacto
              </h3>
              <p
                className="text-xs m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Información registrada en el sistema
              </p>
            </div>
          </div>

          {/* CUERPO DE INFORMACIÓN */}
          <div className="space-y-4">
            {/* TIPO */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/50">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Tipo
              </span>
              <Tag className="m-0 border-none px-3 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400">
                {item.tipo_texto}
              </Tag>
            </div>

            {/* VALOR (EL DATO PRINCIPAL) */}
            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-subtle)] relative group">
              <span
                className="text-xs block mb-1 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Valor del contacto
              </span>
              <div className="flex justify-between items-center">
                <span
                  className="text-base font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.valor}
                </span>
                <Tooltip title={copied ? "¡Copiado!" : "Copiar"}>
                  <Button
                    type="text"
                    size="small"
                    icon={
                      copied ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} />
                      )
                    }
                    onClick={handleCopy}
                    className="hover:bg-white/10"
                  />
                </Tooltip>
              </div>
            </div>

            {/* FECHA DE CREACIÓN */}
            <div className="flex items-center gap-2 px-1">
              <Calendar
                size={12}
                style={{ color: "var(--color-text-secondary)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Registrado el:{" "}
                <span className="font-medium text-[var(--color-text-primary)]">
                  {item.created_at}
                </span>
              </span>
            </div>
          </div>

          {/* BOTÓN CERRAR */}
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
