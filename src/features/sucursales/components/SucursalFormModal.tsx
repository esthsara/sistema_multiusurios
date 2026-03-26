import { Form, Input, Modal, Switch } from "antd";
import { useEffect } from "react";
import type {
  CreateSucursalDto,
  SucursalListItem,
  UpdateSucursalDto,
} from "../types/sucursal.types";

interface SucursalFormModalProps {
  open: boolean;
  selectedItem?: SucursalListItem | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CreateSucursalDto | UpdateSucursalDto) => void;
  onCancel: () => void;
}

interface FormValues {
  nombre: string;
  codigo: string;
  email: string;
  direccion: string;
  descripcion?: string;
  horario_apertura: string;
  horario_cierre: string;
  activa: boolean;
}

export const SucursalFormModal = ({
  open,
  selectedItem,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}: SucursalFormModalProps) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!open) return;

    if (isEditMode && selectedItem) {
      form.setFieldsValue({
        nombre: selectedItem.nombre,
        codigo: selectedItem.codigo,
        email: selectedItem.email,
        direccion: selectedItem.direccion,
        descripcion: selectedItem.descripcion ?? "",
        horario_apertura: selectedItem.horario_apertura ?? "08:00",
        horario_cierre: selectedItem.horario_cierre ?? "18:00",
        activa: selectedItem.activa,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      activa: true,
      horario_apertura: "08:00",
      horario_cierre: "18:00",
    });
  }, [open, isEditMode, selectedItem, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // validación antd
    }
  };

  return (
    <Modal
      open={open}
      title={isEditMode ? "Editar Sucursal" : "Nueva Sucursal"}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditMode ? "Guardar cambios" : "Crear sucursal"}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      width={760}
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: 20 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "El nombre es requerido" }]}
          >
            <Input placeholder="Sucursal Central" />
          </Form.Item>

          <Form.Item
            name="codigo"
            label="Código"
            rules={[{ required: true, message: "El código es requerido" }]}
          >
            <Input placeholder="SC-001" disabled={isEditMode} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "El email es requerido" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input placeholder="sucursal@empresa.com" />
          </Form.Item>

          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: "La dirección es requerida" }]}
          >
            <Input placeholder="Av. Principal 123" />
          </Form.Item>

          <Form.Item
            name="horario_apertura"
            label="Horario apertura"
            rules={[
              { required: true, message: "La hora de apertura es requerida" },
            ]}
          >
            <Input placeholder="08:00" />
          </Form.Item>

          <Form.Item
            name="horario_cierre"
            label="Horario cierre"
            rules={[
              { required: true, message: "La hora de cierre es requerida" },
            ]}
          >
            <Input placeholder="18:00" />
          </Form.Item>
        </div>

        <Form.Item name="descripcion" label="Descripción">
          <Input.TextArea rows={3} placeholder="Descripción opcional" />
        </Form.Item>

        <Form.Item name="activa" label="Estado" valuePropName="checked">
          <Switch checkedChildren="Activa" unCheckedChildren="Inactiva" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
