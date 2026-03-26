// src/features/asignaciones/components/AsignacionModal.tsx
import { useState } from "react";
import { Modal, Form, Select, Checkbox, Spin } from "antd";
import type { ModalProps } from "antd";

interface AsignacionModalProps extends Omit<ModalProps, "children"> {
  usuarios: Array<{ id: number; username: string; email: string }>;
  sucursales: Array<{ id: number; nombre: string; codigo: string }>;
  roles: Array<{ id: number; name: string }>;
  loadingUsers?: boolean;
  loadingSucursales?: boolean;
  loadingRoles?: boolean;
  onSubmit?: (data: {
    usuario_id: number;
    sucursal_id: number;
    rol_id: number;
    es_administrador: boolean;
  }) => Promise<void>;
}

export const AsignacionModal = ({
  usuarios,
  sucursales,
  roles,
  loadingUsers = false,
  loadingSucursales = false,
  loadingRoles = false,
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
      title="Asignar Usuario a Sucursal"
      okText="Asignar"
      cancelText="Cancelar"
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={500}
      okButtonProps={{ loading: submitting }}
      destroyOnClose
    >
      <Spin spinning={loadingUsers || loadingSucursales || loadingRoles}>
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
            name="sucursal_id"
            label="Seleccionar Sucursal"
            rules={[{ required: true, message: "Selecciona una sucursal" }]}
          >
            <Select
              placeholder="Buscar sucursal..."
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
              options={sucursales.map((s) => ({
                value: s.id,
                label: `${s.nombre} (${s.codigo})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="rol_id"
            label="Seleccionar Rol"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select
              placeholder="Selecciona un rol..."
              options={roles.map((r) => ({
                value: r.id,
                label: r.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="es_administrador"
            label="Permisos"
            valuePropName="checked"
          >
            <Checkbox>Es administrador de esta sucursal</Checkbox>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
