import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
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

type PersonaFormContentProps = Omit<PersonaFormModalProps, "tipo"> & {
  tipo: TipoPersona;
};

const PersonaFormContent = ({
  open,
  tipo,
  selectedItem,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}: PersonaFormContentProps) => {
  const [form] = Form.useForm();

  const initialData = React.useMemo(() => {
    if (!isEditMode || !selectedItem) return undefined;

    const cleanItem = Object.fromEntries(
      Object.entries(selectedItem).map(([k, v]) => [
        k,
        v === null ? undefined : v,
      ]),
    ) as Record<string, any>;

    if (
      tipo === "MORAL" &&
      !cleanItem.razon_social &&
      cleanItem.nombre_completo
    ) {
      cleanItem.razon_social = cleanItem.nombre_completo;
    }

    return {
      ...cleanItem,
      fecha_nacimiento: cleanItem.fecha_nacimiento
        ? dayjs(cleanItem.fecha_nacimiento)
        : undefined,
    };
  }, [isEditMode, selectedItem, tipo]);

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
      <User size={22} className="text-[var(--color-primary-600)]" />
    ) : (
      <Building2 size={22} className="text-[var(--color-primary-400)]" />
    );
  };

  const title = isEditMode
    ? `Editar Persona ${tipo === "FISICA" ? "Física" : "Moral"}`
    : `Nueva Persona ${tipo === "FISICA" ? "Física" : "Moral"}`;

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditMode ? "Actualizar" : "Crear persona"}
      cancelText="Cancelar"
      okButtonProps={{ loading: isSubmitting }}
      cancelButtonProps={{ disabled: isSubmitting }}
      width={620}
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
      {/* HEADER  */}
      {/* HEADER MINIMALISTA */}
      <div className="px-8 pt-8 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-start gap-5">
          <div className="mt-1">
            {tipo === "FISICA" ? (
              <User size={24} className="text-[var(--color-primary-600)]" />
            ) : (
              <Building2
                size={24}
                className="text-[var(--color-primary-400)]"
              />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] m-0 leading-none">
              {title}
            </h3>
            <p className="mt-2 text-[13px] text-[var(--color-text-secondary)] opacity-70 leading-snug">
              {tipo === "FISICA"
                ? "Completa la información personal del individuo"
                : "Registra los datos legales de la entidad"}
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <Form
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        preserve={false}
        className="p-8"
        initialValues={initialData}
      >
        <div className="space-y-5">
          {/* FISICA */}
          {tipo === "FISICA" && (
            <>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  name="nombre"
                  label={<span className="font-medium">Nombre</span>}
                  rules={[{ required: true, message: "Ingresa el nombre" }]}
                >
                  <Input placeholder="Ej: Juan" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="apellido"
                  label={<span className="font-medium">Apellido</span>}
                  rules={[{ required: true, message: "Ingresa el apellido" }]}
                >
                  <Input placeholder="Ej: Pérez" className="rounded-lg" />
                </Form.Item>
              </div>

              <Form.Item
                name="identificacion_principal"
                label={<span className="font-medium">Identificación</span>}
                rules={[
                  { required: true, message: "Ingresa la identificación" },
                ]}
              >
                <Input placeholder="Ej: 12345678" className="rounded-lg" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  name="fecha_nacimiento"
                  label={
                    <span className="font-medium">Fecha de nacimiento</span>
                  }
                >
                  <DatePicker
                    className="w-full rounded-lg"
                    placeholder="Seleccionar fecha"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>

                <Form.Item
                  name="genero"
                  label={<span className="font-medium">Género</span>}
                >
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
                label={<span className="font-medium">Razón Social</span>}
                rules={[{ required: true, message: "Ingresa la razón social" }]}
              >
                <Input placeholder="Ej: Empresa SRL" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="identificacion_principal"
                label={<span className="font-medium">NIT / RUC</span>}
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
  );
};

export const PersonaFormModal = (props: PersonaFormModalProps) => {
  if (!props.tipo) {
    return null;
  }

  return <PersonaFormContent {...props} tipo={props.tipo} />;
};
