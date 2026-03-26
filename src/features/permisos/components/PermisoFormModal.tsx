import { Form, Input, Modal, Select, Spin } from "antd";
import type { CreatePermisoDto } from "../types/permiso.types";

interface PermisoFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading: boolean;
  submitting: boolean;
  modulos: string[];
  onCancel: () => void;
  onSubmit: (values: CreatePermisoDto) => Promise<void> | void;
}

const ACCIONES = [
  "ver",
  "crear",
  "editar",
  "eliminar",
  "asignar",
  "exportar",
  "subir",
  "restaurar",
];

export const PermisoFormModal = ({
  open,
  mode,
  loading,
  submitting,
  modulos,
  onCancel,
  onSubmit,
}: PermisoFormModalProps) => {
  const [form] = Form.useForm<CreatePermisoDto>();

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
          initialValues={{
            guard_name: "api",
          }}
        >
          <Form.Item
            name="name"
            label="Nombre del permiso"
            rules={[
              { required: true, message: "Ingresa el nombre del permiso" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
            ]}
          >
            <Input
              placeholder="Ej: usuarios.ver"
              maxLength={80}
              disabled={mode === "edit"}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="modulo"
              label="Módulo"
              rules={[{ required: true, message: "Selecciona un módulo" }]}
            >
              <Select
                placeholder="Selecciona o crea uno nuevo"
                allowClear
                options={modulos.map((m) => ({ label: m, value: m }))}
              />
            </Form.Item>

            <Form.Item
              name="accion"
              label="Acción"
              rules={[{ required: true, message: "Selecciona una acción" }]}
            >
              <Select
                placeholder="Selecciona una acción"
                allowClear
                options={ACCIONES.map((a) => ({ label: a, value: a }))}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="guard_name"
            label="Guard"
            initialValue="api"
            rules={[{ required: true }]}
          >
            <Select disabled options={[{ label: "api", value: "api" }]} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
