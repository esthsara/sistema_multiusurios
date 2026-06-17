import { Modal, Button } from "antd";
import type { ReactNode } from "react";

interface BaseModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onCancel: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  submitText?: string;
  children: ReactNode;
  width?: number | string;
}

export const BaseModal = ({
  open,
  title,
  subtitle,
  onCancel,
  onSubmit,
  loading,
  submitText = "Guardar",
  children,
  width = 720,
}: BaseModalProps) => {
  return (
    <Modal open={open} footer={null} onCancel={onCancel} centered width={width}>
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>

        {children}

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancelar</Button>
          {onSubmit && (
            <Button type="primary" loading={loading} onClick={onSubmit}>
              {submitText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
