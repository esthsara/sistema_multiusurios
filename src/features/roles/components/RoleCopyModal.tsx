import { Form, Input, Modal, Alert } from "antd";
import { useEffect } from "react";

interface RoleCopyModalProps {
  open: boolean;
  sourceRoleName?: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (newName: string) => Promise<void> | void;
}

export const RoleCopyModal = ({
  open,
  sourceRoleName,
  loading,
  onCancel,
  onConfirm,
}: RoleCopyModalProps) => {
  const [form] = Form.useForm<{ newName: string }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        newName: sourceRoleName ? `Copia de ${sourceRoleName}` : "Copia Rol",
      });
    }
  }, [open, sourceRoleName, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onConfirm(values.newName.trim());
      form.resetFields();
    } catch {
      // validación
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Copiar rol"
      okText="Crear copia"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      destroyOnHidden
    >
      {/* 🔥 CONTEXTO MEJORADO */}
      <Alert
        type="info"
        showIcon
        className="mb-4"
        message="Clonación de rol"
        description={`Se creará una copia de "${
          sourceRoleName ?? "este rol"
        }" incluyendo todos sus permisos y configuración actual.`}
      />

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="newName"
          label="Nuevo nombre del rol"
          rules={[
            { required: true, message: "Ingresa el nombre del nuevo rol" },
            { min: 3, message: "Debe tener al menos 3 caracteres" },
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject("El nombre no puede estar vacío");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            maxLength={90}
            placeholder="Ej: Copia Administrador"
            autoFocus
            style={{
              borderRadius: 8,
              borderColor: "var(--color-border)",
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
