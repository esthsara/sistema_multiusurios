import { useEffect } from "react";
import { Form, Input, Modal, Select, Spin } from "antd";
import type { CreatePermisoDto } from "../types/permiso.types";

interface PermisoFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading: boolean;
  submitting: boolean;
  initialValues?: Partial<CreatePermisoDto>;
  onCancel: () => void;
  onSubmit: (values: CreatePermisoDto) => Promise<void> | void;
}

export const PermisoFormModal = ({
  open,
  mode,
  loading,
  submitting,
  initialValues,
  onCancel,
  onSubmit,
}: PermisoFormModalProps) => {
  const [form] = Form.useForm<CreatePermisoDto>();

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      guard_name: "api",
      name: initialValues?.name,
    });
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch {
      // validación de formulario
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Crear permiso" : "Editar permiso"}
      okText={mode === "create" ? "Crear" : "Guardar cambios"}
      cancelText="Cancelar"
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: submitting }}
      cancelButtonProps={{ disabled: submitting }}
      width={600}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nombre del permiso"
            rules={[
              { required: true, message: "Ingresa el nombre del permiso" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
            ]}
          >
            <Input placeholder="Ej: kae.algo" maxLength={80} />
          </Form.Item>

          <Form.Item
            name="guard_name"
            label="Guard"
            rules={[{ required: true }]}
          >
            <Select disabled options={[{ label: "api", value: "api" }]} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
