import { Modal, Form, Input, Select, Switch, Spin } from "antd";
import { useState, useEffect } from "react";
import { UserCog, ShieldCheck } from "lucide-react";
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

interface FormValues {
  persona_id?: number;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  activo: boolean;
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
  const [personasLoaded, setPersonasLoaded] = useState(false);

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
    } catch {}
  };

  const title = isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario";

  return (
    <Modal
      open={open}
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
          WebkitBackdropFilter: "blur(6px)",
        },
      }}
    >
      {/* HEADER */}
      <div className="px-8 pt-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <UserCog size={20} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] m-0">
              {title}
            </h3>
            <p className="text-[12px] text-[var(--color-text-secondary)] opacity-70 m-0">
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

            <div className="mt-2">
              {!isEditMode ? (
                <Form.Item
                  name="persona_id"
                  label={
                    <span className="text-sm font-medium">
                      Vincular Persona
                    </span>
                  }
                  rules={[
                    { required: true, message: "Selecciona una persona" },
                  ]}
                >
                  <Select
                    placeholder="Busca por nombre o identificación"
                    showSearch
                    optionFilterProp="label"
                    className="rounded-lg"
                    options={personas.map((p) => ({
                      value: p.id,
                      label: `${p.razon_social || `${p.nombre ?? ""} ${p.apellido ?? ""}`.trim()} (${p.identificacion_principal})`,
                    }))}
                  />
                </Form.Item>
              ) : (
                selectedItem && (
                  <div className="px-4 py-3 rounded-lg border border-emerald-100 bg-emerald-50/40 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-emerald-900 leading-none mb-1">
                        Persona Vinculada
                      </span>
                      <span className="text-[13px] font-semibold text-emerald-900 leading-none">
                        {selectedItem.persona.razon_social ||
                          `${selectedItem.persona.nombre ?? ""} ${selectedItem.persona.apellido ?? ""}`.trim()}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* INPUTS PRINCIPALES */}
            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                name="username"
                label={<span className="text-sm font-medium">Usuario</span>}
                rules={[{ required: true, message: "Requerido" }]}
                className="m-0"
              >
                <Input placeholder="usuario123" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-sm font-medium">Email</span>}
                rules={[
                  { required: true, message: "Requerido" },
                  { type: "email", message: "Email inválido" },
                ]}
                className="m-0"
              >
                <Input
                  placeholder="correo@ejemplo.com"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* PASSWORDS (SOLO CREACIÓN) */}
            {!isEditMode && (
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  name="password"
                  label={
                    <span className="text-sm font-medium">Contraseña</span>
                  }
                  rules={[{ required: true, message: "Requerida" }]}
                  className="m-0"
                >
                  <Input.Password
                    placeholder="••••••••"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="password_confirmation"
                  label={<span className="text-sm font-medium">Confirmar</span>}
                  rules={[{ required: true, message: "Confirma" }]}
                  className="m-0"
                >
                  <Input.Password
                    placeholder="••••••••"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            )}

            {/* ESTADO DE CUENTA - Alineado y compacto */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 mt-2">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-700">
                  Estado de la cuenta
                </span>
                <span className="text-[11px] text-gray-500">
                  Define si el usuario puede acceder
                </span>
              </div>
              <Form.Item name="activo" valuePropName="checked" className="m-0">
                <Switch
                  checkedChildren="Activo"
                  unCheckedChildren="Inactivo"
                  className={
                    form.getFieldValue("activo") === false
                      ? "bg-gray-400"
                      : "bg-blue-500"
                  }
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
