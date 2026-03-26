import { Form, Input, Modal } from "antd";

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onConfirm(values.newName);
    } catch {
      // validación de formulario
    }
  };

  return (
    <Modal
      open={open}
      title="Copiar rol"
      okText="Crear copia"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      destroyOnHidden
    >
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Se creará una copia de <strong>{sourceRoleName ?? "este rol"}</strong>{" "}
        con los mismos permisos.
      </p>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          newName: sourceRoleName ? `Copia ${sourceRoleName}` : "Copia Rol 1",
        }}
        className="mt-3"
      >
        <Form.Item
          name="newName"
          label="Nuevo nombre del rol"
          rules={[
            { required: true, message: "Ingresa el nuevo nombre" },
            { min: 3, message: "Debe tener al menos 3 caracteres" },
          ]}
        >
          <Input maxLength={90} placeholder="Ej: Copia Rol 1" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
