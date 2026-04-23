import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  ConfigProvider,
  theme,
} from "antd";
import { User, Building2 } from "lucide-react";
import dayjs from "dayjs";
import type { TipoPersona } from "@/shared/types/auth.types";
import type {
  CreatePersonaDto,
  PersonaDetalle,
  PersonaListItem,
  UpdatePersonaDto,
} from "../types/persona.types";

type PersonaFormSelectedItem = PersonaListItem | PersonaDetalle;

type PersonaFormModalProps = {
  open: boolean;
  tipo: TipoPersona | null;
  selectedItem: PersonaFormSelectedItem | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (
    values: CreatePersonaDto | UpdatePersonaDto,
  ) => void | Promise<void>;
  onCancel: () => void;
};

export const PersonaFormModal = ({
  open,
  tipo,
  selectedItem,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}: PersonaFormModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (isEditMode && selectedItem) {
      const hasFechaNacimiento =
        "fecha_nacimiento" in selectedItem && selectedItem.fecha_nacimiento;

      form.setFieldsValue({
        ...selectedItem,
        fecha_nacimiento: hasFechaNacimiento
          ? dayjs(selectedItem.fecha_nacimiento)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, isEditMode, selectedItem, form]);

  if (!tipo) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const dto = {
        ...values,
        tipo_persona: tipo,
        fecha_nacimiento: values.fecha_nacimiento
          ? values.fecha_nacimiento.format("YYYY-MM-DD")
          : undefined,
      };

      onSubmit(dto);
    } catch {}
  };

  const getIcon = () => {
    return tipo === "FISICA" ? (
      <User size={18} className="text-blue-400" />
    ) : (
      <Building2 size={18} className="text-purple-400" />
    );
  };

  const title = isEditMode
    ? `Editar Persona ${tipo === "FISICA" ? "Física" : "Moral"}`
    : `Nueva Persona ${tipo === "FISICA" ? "Física" : "Moral"}`;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "var(--color-bg-base)",
        },
      }}
    >
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={isEditMode ? "Actualizar" : "Crear persona"}
        cancelText="Cancelar"
        okButtonProps={{ loading: isSubmitting }}
        cancelButtonProps={{ disabled: isSubmitting }}
        width={720}
        centered
        destroyOnClose
        title={null}
        maskStyle={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* HEADER PRO */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold m-0 text-[var(--color-text-primary)]">
              {title}
            </h3>
            <p className="text-xs m-0 text-[var(--color-text-secondary)]">
              {tipo === "FISICA"
                ? "Completa los datos de la persona"
                : "Registra los datos de la empresa"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <Form
          form={form}
          layout="vertical"
          size="large"
          requiredMark={false}
          preserve={false}
        >
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/40 space-y-4">
            {/* FISICA */}
            {tipo === "FISICA" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: "Ingresa el nombre" }]}
                  >
                    <Input placeholder="Ej: Juan" className="rounded-lg" />
                  </Form.Item>

                  <Form.Item
                    name="apellido"
                    label="Apellido"
                    rules={[{ required: true, message: "Ingresa el apellido" }]}
                  >
                    <Input placeholder="Ej: Pérez" className="rounded-lg" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="identificacion_principal"
                  label="Identificación"
                  rules={[
                    { required: true, message: "Ingresa la identificación" },
                  ]}
                >
                  <Input placeholder="Ej: 12345678" className="rounded-lg" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="fecha_nacimiento"
                    label="Fecha de nacimiento"
                  >
                    <DatePicker
                      className="w-full rounded-lg"
                      placeholder="Seleccionar fecha"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>

                  <Form.Item name="genero" label="Género">
                    <Select placeholder="Seleccionar" className="rounded-lg">
                      <Select.Option value="M">Masculino</Select.Option>
                      <Select.Option value="F">Femenino</Select.Option>
                      <Select.Option value="Otro">Otro</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </>
            )}

            {/* MORAL */}
            {tipo === "MORAL" && (
              <>
                <Form.Item
                  name="razon_social"
                  label="Razón Social"
                  rules={[
                    { required: true, message: "Ingresa la razón social" },
                  ]}
                >
                  <Input placeholder="Ej: Empresa SRL" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="identificacion_principal"
                  label="NIT / RUC"
                  rules={[
                    { required: true, message: "Ingresa la identificación" },
                  ]}
                >
                  <Input placeholder="Ej: 123456789" className="rounded-lg" />
                </Form.Item>
              </>
            )}
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
