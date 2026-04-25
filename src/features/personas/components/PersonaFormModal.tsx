import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { User, Building2 } from "lucide-react";
import dayjs, { type Dayjs } from "dayjs";
import type { TipoPersona } from "@/shared/types/auth.types";
import type {
  CreatePersonaDto,
  PersonaDetalle,
  PersonaListItem,
  UpdatePersonaDto,
} from "../types/persona.types";

type PersonaFormSelectedItem = PersonaListItem | PersonaDetalle;

type PersonaFormValues = {
  nombre?: string;
  apellido?: string;
  razon_social?: string;
  identificacion_principal?: string;
  fecha_nacimiento?: Dayjs | null;
  genero?: "M" | "F" | "Otro";
};

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
  // TODOS los hooks deben estar aquí, en el nivel superior
  const [form] = Form.useForm<PersonaFormValues>();

  const isFisica = tipo === "FISICA";

  const title = isEditMode
    ? `Editar Persona ${isFisica ? "Física" : "Moral"}`
    : `Nueva Persona ${isFisica ? "Física" : "Moral"}`;

  const description = isFisica
    ? "Completa la información personal del individuo"
    : "Registra los datos legales de la entidad";

  // useEffect DEBE estar aquí, nunca dentro de condicionales
  useEffect(() => {
    if (!open || !tipo) return;

    if (isEditMode && selectedItem) {
      const hasFechaNacimiento =
        "fecha_nacimiento" in selectedItem && selectedItem.fecha_nacimiento;

      // Construir valores iniciales solo con campos relevantes según tipo
      // Esto evita que el formulario tenga campos no deseados
      const initialValues: PersonaFormValues = isFisica
        ? {
            nombre: selectedItem.nombre ?? undefined,
            apellido: selectedItem.apellido ?? undefined,
            identificacion_principal:
              selectedItem.identificacion_principal ?? undefined,
            fecha_nacimiento: hasFechaNacimiento
              ? dayjs(selectedItem.fecha_nacimiento as string)
              : null,
            genero:
              "genero" in selectedItem && selectedItem.genero
                ? (selectedItem.genero as "M" | "F" | "Otro")
                : undefined,
          }
        : {
            razon_social: selectedItem.razon_social ?? undefined,
            identificacion_principal:
              selectedItem.identificacion_principal ?? undefined,
          };

      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, isEditMode, selectedItem, isFisica, tipo, form]);

  // Validación DESPUÉS de todos los hooks
  if (!open || !tipo) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Construir DTO solo con campos válidos según tipo_persona
      // Esto previene error 422 por campos inesperados en validación
      const baseDto = {
        tipo_persona: tipo,
        fecha_nacimiento: values.fecha_nacimiento
          ? values.fecha_nacimiento.format("YYYY-MM-DD")
          : undefined,
      };

      const dto: CreatePersonaDto | UpdatePersonaDto = isFisica
        ? {
            ...baseDto,
            nombre: values.nombre,
            apellido: values.apellido,
            identificacion_principal: values.identificacion_principal,
            genero: values.genero,
          }
        : {
            ...baseDto,
            razon_social: values.razon_social,
            identificacion_principal: values.identificacion_principal,
          };

      await onSubmit(dto);
    } catch {}
  };

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
            {isFisica ? (
              <User size={24} className="text-blue-400 " />
            ) : (
              <Building2 size={24} className="text-purple-400" />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] m-0 leading-none">
              {title}
            </h3>
            <p className="mt-2 text-[13px] text-[var(--color-text-secondary)] opacity-70 leading-snug">
              {description}
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
      >
        <div className="space-y-5">
          {/* FISICA */}
          {isFisica && (
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
                  <Select
                    placeholder="Seleccionar"
                    className="rounded-lg"
                    options={[
                      { value: "M", label: "Masculino" },
                      { value: "F", label: "Femenino" },
                      { value: "Otro", label: "Otro" },
                    ]}
                  />
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
