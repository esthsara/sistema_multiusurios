// src/features/personas/components/PersonaTypeSelector.tsx
import { Modal, Card } from "antd";
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
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={480}
      title="Seleccionar tipo de persona"
    >
      <p
        className="text-sm mb-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Elige el tipo de persona que deseas registrar.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Persona Física */}
        <Card
          hoverable
          className="cursor-pointer text-center transition-all"
          onClick={() => onSelect("FISICA")}
          style={{ border: "2px solid var(--color-border)" }}
        >
          <div className="flex flex-col items-center gap-3 py-2">
            <div
              className="w-14 h-14 rounded-full flex items-center
                            justify-center"
              style={{ backgroundColor: "var(--color-primary-50)" }}
            >
              <User size={28} style={{ color: "var(--color-primary-600)" }} />
            </div>
            <div>
              <p
                className="font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Persona Física
              </p>
              <p
                className="text-xs mt-1 m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Persona individual que actúa a título personal. Ejemplo: Juan
                Pérez.
              </p>
            </div>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium
                         transition-colors text-white"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              Seleccionar
            </button>
          </div>
        </Card>

        {/* Persona Moral */}
        <Card
          hoverable
          className="cursor-pointer text-center transition-all"
          onClick={() => onSelect("MORAL")}
          style={{ border: "2px solid var(--color-border)" }}
        >
          <div className="flex flex-col items-center gap-3 py-2">
            <div
              className="w-14 h-14 rounded-full flex items-center
                            justify-center"
              style={{ backgroundColor: "rgba(99,102,241,0.1)" }}
            >
              <Building2 size={28} style={{ color: "#0004ff" }} />
            </div>
            <div>
              <p
                className="font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Persona Moral
              </p>
              <p
                className="text-xs mt-1 m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Empresa u organización registrada legalmente. Ejemplo: TABLET
                S.R.L.
              </p>
            </div>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium
                         transition-colors text-white"
              style={{ backgroundColor: "#6366f1" }}
            >
              Seleccionar
            </button>
          </div>
        </Card>
      </div>
    </Modal>
  );
};
