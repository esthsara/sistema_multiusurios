import { Modal, Button } from "antd";

export const BaseModal = ({
  open,
  title,
  subtitle,
  onCancel,
  onSubmit,
  loading,
  submitText = "Guardar",
  children,
}: any) => {
  return (
    <Modal open={open} footer={null} onCancel={onCancel} centered width={720}>
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
