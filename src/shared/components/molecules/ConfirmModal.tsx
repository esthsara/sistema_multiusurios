// src/shared/components/molecules/ConfirmModal.tsx
import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmModal — Modal de confirmación estándar.
 * Usado para eliminar, desactivar o cualquier acción destructiva.
 *
 * ¿Por qué no usar Modal.confirm() de Ant Design?
 * Modal.confirm es imperativo — dificulta el control del loading state
 * y no se integra bien con nuestro sistema de permisos y toasts.
 * Este componente es declarativo y controlado.
 */
export const ConfirmModal = ({
  open,
  title = "¿Estás seguro?",
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  danger = true,
  icon,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        loading,
      }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={!loading}
      destroyOnClose
      width={420}
    >
      <div className="flex items-start gap-4 py-2">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full
                        flex items-center justify-center"
          style={{
            backgroundColor: danger
              ? "var(--color-alert-danger-bg)"
              : "var(--color-alert-warning-bg)",
          }}
        >
          {icon ?? (
            <AlertTriangle
              size={20}
              style={{
                color: danger
                  ? "var(--color-danger-500)"
                  : "var(--color-warning-500)",
              }}
            />
          )}
        </div>
        <div>
          <h3
            className="font-semibold text-base m-0 mb-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm m-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};
