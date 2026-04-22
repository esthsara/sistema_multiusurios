import { Modal, Form, Input, Select, Switch, Spin, Divider } from "antd";
import { useState, useEffect } from "react";
import { personasService } from "@/features/personas/services/personas.service";
import type { PersonaListItem } from "@/features/personas/types/persona.types";
import type { UsuarioListItem } from "../types/usuario.types";

interface UsuarioFormModalProps {
  open: boolean;
  selectedItem?: UsuarioListItem | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const UsuarioFormModal = ({
  open,
  selectedItem,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}: UsuarioFormModalProps) => {
  const [form] = Form.useForm();
  const [personas, setPersonas] = useState<PersonaListItem[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [personasLoaded, setPersonasLoaded] = useState(false);

  /* Cargar personas disponibles */
  useEffect(() => {
    if (open && !isEditMode && !personasLoaded) {
      setLoadingPersonas(true);
      personasService
        .getAll({ page: 1, per_page: 100 })
        .then((res) => {
          setPersonas(
            Array.isArray(res.data)
              ? res.data.filter((p) => !p.usuario_asociado)
              : [],
          );
          setPersonasLoaded(true);
        })
        .finally(() => setLoadingPersonas(false));
    }
  }, [open, isEditMode, personasLoaded]);

  /* Rellenar formulario en modo edición */
  useEffect(() => {
    if (open && isEditMode && selectedItem) {
      form.setFieldsValue({
        persona_id: selectedItem.persona.id,
        username: selectedItem.username,
        email: selectedItem.email,
        activo: selectedItem.activo,
      });
    } else if (open && !isEditMode) {
      form.resetFields();
    }
  }, [open, isEditMode, selectedItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      /* Errores de validación mostrados por Ant Design */
    }
  };

  return (
    <Modal
      title={isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEditMode ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      width={760}
      centered
    >
      <Spin spinning={loadingPersonas}>
        <Form
          form={form}
          layout="vertical"
          size="large"
          autoComplete="off"
          style={{ marginTop: 24 }}
        >
          {/* Persona - Solo en creación */}
          {!isEditMode && (
            <Form.Item
              name="persona_id"
              label="Persona"
              rules={[{ required: true, message: "Selecciona una persona" }]}
            >
              <Select
                placeholder="Selecciona una persona"
                optionLabelProp="label"
                showSearch
                optionFilterProp="label"
                options={personas.map((p) => ({
                  value: p.id,
                  label: `${p.razon_social || `${p.nombre ?? ""} ${p.apellido ?? ""}`.trim()} (${p.identificacion_principal})`,
                }))}
              />
            </Form.Item>
          )}

          {isEditMode && selectedItem && (
            <>
              <div
                style={{
                  padding: "12px",
                  background: "var(--color-bg-overlay)",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "16px",
                }}
              >
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 500 }}>
                  Persona Asociada
                </p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {selectedItem.persona.razon_social ||
                    `${selectedItem.persona.nombre ?? ""} ${selectedItem.persona.apellido ?? ""}`.trim()}
                </p>
              </div>
              <Divider style={{ margin: "0 0 16px 0" }} />
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {/* Username */}
            <Form.Item
              name="username"
              label="Usuario"
              rules={[
                { required: true, message: "El usuario es requerido" },
                {
                  min: 3,
                  message: "El usuario debe tener al menos 3 caracteres",
                },
              ]}
            >
              <Input placeholder="Ej: admin123" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "El email es requerido" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input type="email" placeholder="Ej: juan@email.com" />
            </Form.Item>
          </div>

          {/* Password - Solo en creación */}
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                  { required: true, message: "La contraseña es requerida" },
                  {
                    min: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirmar Contraseña"
                rules={[
                  { required: true, message: "Confirma tu contraseña" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Las contraseñas no coinciden"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
            </div>
          )}

          {/* Estado */}
          <Form.Item name="activo" label="Estado" valuePropName="checked">
            <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              defaultChecked
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
