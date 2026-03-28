// src/features/asignaciones/components/AsignacionModal.tsx
import { useState } from "react";
import { Modal, Form, Select, Spin, Card, Typography } from "antd";
import type { ModalProps } from "antd";

interface AsignacionModalProps extends Omit<ModalProps, "children"> {
  usuarios: Array<{ id: number; username: string; email: string }>;
  roles: Array<{ id: number; name: string }>;
  loading?: boolean;
  sucursal?: { id: number; nombre: string; codigo: string };
  onSubmit?: (data: { usuario_id: number; rol_id: number }) => Promise<void>;
}

const { Text } = Typography;

export const AsignacionModal = ({
  usuarios,
  roles,
  loading = false,
  sucursal,
  onSubmit,
  ...modalProps
}: AsignacionModalProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(values);
      }
      form.resetFields();
    } catch {
      // Validación de Ant Design
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    if (modalProps.onCancel) {
      modalProps.onCancel({} as any);
    }
  };

  return (
    <Modal
      {...modalProps}
      title={`Asignar Usuario a ${sucursal?.nombre || "Sucursal"}`}
      okText="Asignar"
      cancelText="Cancelar"
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={500}
      okButtonProps={{ loading: submitting }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {sucursal && (
          <Card
            size="small"
            style={{
              marginBottom: "16px",
              backgroundColor: "var(--color-bg-tertiary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Text strong>{sucursal.nombre}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Código: {sucursal.codigo}
            </Text>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="usuario_id"
            label="Seleccionar Usuario"
            rules={[{ required: true, message: "Selecciona un usuario" }]}
          >
            <Select
              placeholder="Buscar usuario..."
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
              options={usuarios.map((u) => ({
                value: u.id,
                label: `${u.username} (${u.email})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="rol_id"
            label="Seleccionar Rol"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select
              placeholder="Elige un rol para este usuario en esta sucursal..."
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
              options={roles.map((r) => ({
                value: r.id,
                label: r.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
