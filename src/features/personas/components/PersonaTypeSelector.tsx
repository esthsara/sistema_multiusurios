import { Modal, Card, ConfigProvider, theme } from "antd";
import { User, Building2 } from "lucide-react";
import type { TipoPersona } from "@/shared/types/auth.types";

interface PersonaTypeSelectorProps {
  open: boolean;
  onSelect: (tipo: TipoPersona) => void;
  onCancel: () => void;
}

export const PersonaTypeSelector = ({
  open,
  onSelect,
  onCancel,
}: PersonaTypeSelectorProps) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "var(--color-bg-base)",
        },
      }}
    >
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        centered
        width={520}
        destroyOnHidden
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }}
      >
        <div className="pt-2">
          {/* HEADER */}
          <div className="mb-6 text-center">
            <h2
              className="text-xl font-semibold m-0"
              style={{ color: "var(--color-text-primary)" }}
            >
              Selecciona el tipo de persona
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Esta elección definirá los campos del formulario
            </p>
          </div>

          {/* OPCIONES */}
          <div className="grid grid-cols-2 gap-4">
            {/* FISICA */}
            <Card
              hoverable
              onClick={() => onSelect("FISICA")}
              className="cursor-pointer group rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(10px)",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                {/* ICONO */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "var(--color-primary-50)",
                  }}
                >
                  <User
                    size={30}
                    style={{ color: "var(--color-primary-600)" }}
                  />
                </div>

                {/* TEXTO */}
                <div>
                  <p
                    className="font-semibold m-0 text-base"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Persona Física
                  </p>
                  <p
                    className="text-xs mt-1 m-0 leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Persona individual que actúa a título personal.
                  </p>
                </div>

                {/* CTA VISUAL */}
                <div
                  className="text-xs font-medium opacity-0 group-hover:opacity-100 transition"
                  style={{ color: "var(--color-primary-500)" }}
                >
                  Seleccionar →
                </div>
              </div>
            </Card>

            {/* MORAL */}
            <Card
              hoverable
              onClick={() => onSelect("MORAL")}
              className="cursor-pointer group rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(10px)",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                {/* ICONO */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "var(--color-alert-primary-bg)",
                  }}
                >
                  <Building2
                    size={30}
                    style={{ color: "var(--color-primary-700)" }}
                  />
                </div>

                {/* TEXTO */}
                <div>
                  <p
                    className="font-semibold m-0 text-base"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Persona Moral
                  </p>
                  <p
                    className="text-xs mt-1 m-0 leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Empresa u organización registrada legalmente.
                  </p>
                </div>

                {/* CTA VISUAL */}
                <div
                  className="text-xs font-medium opacity-0 group-hover:opacity-100 transition"
                  style={{ color: "var(--color-primary-500)" }}
                >
                  Seleccionar →
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
