import { Form, Input, Modal, Switch, Upload, Button } from "antd";
import { useEffect, useState } from "react";
import type {
  CreateSucursalDto,
  SucursalListItem,
  UpdateSucursalDto,
} from "../types/sucursal.types";
import { UploadOutlined } from "@ant-design/icons";

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
  logo?: File;
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
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      setLogoFile(null);
      return;
    }

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
      onSubmit({ ...values, ...(logoFile ? { logo: logoFile } : {}) });
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
      centered
      destroyOnClose
      width={780}
    >
      <div
        className="mb-4 rounded-xl border px-4 py-3"
        style={{
          background: "var(--color-bg-overlay)",
          borderColor: "var(--color-border)",
        }}
      >
        <p
          className="m-0 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {isEditMode
            ? "Actualiza la información de la sucursal seleccionada."
            : "Completa los datos para crear una nueva sucursal."}
        </p>
      </div>

      <Form<FormValues>
        form={form}
        layout="vertical"
        size="large"
        autoComplete="off"
        style={{ marginTop: 20 }}
        disabled={isSubmitting}
      >
        <div
          className="mb-4 rounded-xl border p-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Datos generales
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: "El nombre es requerido" }]}
            >
              <Input placeholder="Ej: Sucursal Central" />
            </Form.Item>

            <Form.Item
              name="codigo"
              label="Código"
              rules={[{ required: true, message: "El código es requerido" }]}
            >
              <Input placeholder="Ej: SC-001" disabled={isEditMode} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "El email es requerido" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input placeholder="Ej: sucursal@empresa.com" />
            </Form.Item>

            <Form.Item
              name="direccion"
              label="Dirección"
              rules={[{ required: true, message: "La dirección es requerida" }]}
            >
              <Input placeholder="Ej: Av. Principal 123" />
            </Form.Item>

            <Form.Item
              name="horario_apertura"
              label="Horario apertura"
              rules={[
                {
                  required: true,
                  message: "La hora de apertura es requerida",
                },
              ]}
            >
              <Input placeholder="Ej: 08:00" />
            </Form.Item>

            <Form.Item
              name="horario_cierre"
              label="Horario cierre"
              rules={[
                { required: true, message: "La hora de cierre es requerida" },
              ]}
            >
              <Input placeholder="Ej: 18:00" />
            </Form.Item>
          </div>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Configuración adicional
          </p>

          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={3} placeholder="Ej: Descripción opcional" />
          </Form.Item>

          <Form.Item name="logo" label="Logo">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={(file) => {
                // Captura el File sin subirlo automáticamente
                setLogoFile(file);
                return false;
              }}
              onRemove={() => setLogoFile(null)}
            >
              <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="activa" label="Estado" valuePropName="checked">
            <Switch checkedChildren="Activa" unCheckedChildren="Inactiva" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
