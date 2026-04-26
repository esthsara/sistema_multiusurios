import { Modal, Form, Input, Select, Switch, Spin } from "antd";
import { useState, useEffect } from "react";
import { UserCog, ShieldCheck } from "lucide-react";
import { personasService } from "@/features/personas/services/personas.service";
import type { PersonaListItem } from "@/features/personas/types/persona.types";
import type { UsuarioListItem, FormValues } from "../types/usuario.types";

interface UsuarioFormModalProps {
  open: boolean;
  selectedItem?: UsuarioListItem | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: FormValues) => void;
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
  const [form] = Form.useForm<FormValues>();
  const [personas, setPersonas] = useState<PersonaListItem[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);

  // 🔹 Cargar personas
  useEffect(() => {
    if (!open || isEditMode) return;

    setLoadingPersonas(true);

    personasService
      .getAll({ page: 1, per_page: 100 })
      .then((res) => {
        setPersonas(
          Array.isArray(res.data)
            ? res.data.filter((p) => !p.usuario_asociado)
            : [],
        );
      })
      .finally(() => setLoadingPersonas(false));
  }, [open, isEditMode]);

  // 🔹 Setear valores
  useEffect(() => {
    if (!open) return;

    if (isEditMode && selectedItem) {
      form.setFieldsValue({
        persona_id: selectedItem.persona.id,
        username: selectedItem.username,
        email: selectedItem.email,
        activo: selectedItem.activo,
      });
    } else {
      form.resetFields();
    }
  }, [open, isEditMode, selectedItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {}
  };

  const title = isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario";

  return (
    <Modal
      open={open}
      forceRender
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={isEditMode ? "Actualizar" : "Crear usuario"}
      cancelText="Cancelar"
      okButtonProps={{ loading: isSubmitting }}
      cancelButtonProps={{ disabled: isSubmitting }}
      width={580}
      centered
      destroyOnHidden
      title={null}
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
        },
      }}
    >
      {/* HEADER */}
      <div className="px-8 pt-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-[var(--color-alert-primary-bg)] border border-[var(--color-border-focus)]">
            <UserCog size={20} className="text-[var(--color-primary-600)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] m-0">
              {title}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] opacity-70 m-0">
              {isEditMode
                ? "Ajusta las credenciales y el acceso del usuario"
                : "Configura una nueva cuenta de acceso"}
            </p>
          </div>
        </div>
      </div>

      <Spin spinning={loadingPersonas}>
        <Form<FormValues>
          form={form}
          layout="vertical"
          size="large"
          requiredMark={false}
          className="px-8 pt-4 pb-8"
          autoComplete="off"
        >
          <div className="space-y-5">
            {/* PERSONA */}
            {!isEditMode ? (
              <Form.Item
                name="persona_id"
                label="Vincular Persona"
                rules={[{ required: true, message: "Selecciona una persona" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Busca por nombre o identificación"
                  options={personas.map((p) => ({
                    value: p.id,
                    label: `${
                      p.razon_social ||
                      `${p.nombre ?? ""} ${p.apellido ?? ""}`.trim()
                    } (${p.identificacion_principal})`,
                  }))}
                />
              </Form.Item>
            ) : (
              selectedItem && (
                <div className="px-4 py-3 rounded-lg border border-[var(--color-success-600)] bg-[var(--color-alert-success-bg)] flex items-center gap-3">
                  <ShieldCheck
                    size={16}
                    className="text-[var(--color-success-500)]"
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] m-0">
                      Persona vinculada
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] m-0">
                      {selectedItem.persona.razon_social ||
                        `${selectedItem.persona.nombre ?? ""} ${selectedItem.persona.apellido ?? ""}`.trim()}
                    </p>
                  </div>
                </div>
              )
            )}

            {/* DATOS */}
            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                name="username"
                label="Usuario"
                rules={[{ required: true, message: "Requerido" }]}
              >
                <Input placeholder="usuario123" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Requerido" },
                  { type: "email", message: "Email inválido" },
                ]}
              >
                <Input placeholder="correo@ejemplo.com" />
              </Form.Item>
            </div>

            {/* PASSWORD */}
            {!isEditMode && (
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[
                    { required: true, message: "Requerida" },
                    { min: 8, message: "Mínimo 8 caracteres" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="password_confirmation"
                  label="Confirmar"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Confirma" },
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
                  <Input.Password />
                </Form.Item>
              </div>
            )}

            {/* ESTADO */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] ">
              <div>
                <p className="text-sm font-semibold m-0">Estado de la cuenta</p>
                <p className="text-xs text-[var(--color-text-secondary)] m-0">
                  Permitir acceso al sistema
                </p>
              </div>

              <Form.Item name="activo" valuePropName="checked" className="m-0">
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
