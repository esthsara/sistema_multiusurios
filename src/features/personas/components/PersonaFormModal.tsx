// src/features/personas/components/PersonaFormModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { TipoPersona } from "@/shared/types/auth.types";
import type {
  PersonaListItem,
  PersonaDetalle,
  CreatePersonaDto,
  UpdatePersonaDto,
} from "../types/persona.types";

interface PersonaFormModalProps {
  open: boolean;
  tipo: TipoPersona | null;
  selectedItem: PersonaListItem | PersonaDetalle | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (values: CreatePersonaDto | UpdatePersonaDto) => void;
  onCancel: () => void;
}

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

  /* Rellena el form al editar */
  useEffect(() => {
    if (!open) return;

    if (isEditMode && selectedItem) {
      const hasFechaNacimiento = "fecha_nacimiento" in selectedItem;
      const fechaNacimiento = hasFechaNacimiento
        ? selectedItem.fecha_nacimiento
        : null;
      const genero = "genero" in selectedItem ? selectedItem.genero : null;

      form.setFieldsValue({
        nombre: selectedItem.nombre,
        apellido: selectedItem.apellido,
        razon_social: selectedItem.razon_social,
        identificacion_principal: selectedItem.identificacion_principal,
        fecha_nacimiento: fechaNacimiento ? dayjs(fechaNacimiento) : null,
        genero: genero ?? null,
      });
    } else {
      form.resetFields();
    }
  }, [open, isEditMode, selectedItem, form]);

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
    } catch {
      /* validación de Ant Design — no hace nada */
    }
  };

  const title = isEditMode
    ? `Editar Persona ${tipo === "FISICA" ? "Física" : "Moral"}`
    : `Nueva Persona ${tipo === "FISICA" ? "Física" : "Moral"}`;

  return (
    <Modal
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditMode ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
      okButtonProps={{ loading: isSubmitting }}
      cancelButtonProps={{ disabled: isSubmitting }}
      destroyOnHidden
      width={760}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        className="mt-4"
        preserve={false}
      >
        <div
          className="rounded-xl border p-5 bg-white dark:bg-transparent"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Datos generales
          </p>
        {tipo === "FISICA" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true, message: "Ingresa el nombre" }]}
              >
                <Input placeholder="Ej: Juan" />
              </Form.Item>

              <Form.Item
                name="apellido"
                label="Apellido"
                rules={[{ required: true, message: "Ingresa el apellido" }]}
              >
                <Input placeholder="Ej: Pérez" />
              </Form.Item>
            </div>

            <Form.Item
              name="identificacion_principal"
              label="Identificación"
              rules={[{ required: true, message: "Ingresa la identificación" }]}
            >
              <Input placeholder="Ej: V-12345678" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="fecha_nacimiento" label="Fecha de nacimiento">
                <DatePicker
                  className="w-full"
                  placeholder="Ej: 1990-12-31"
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item name="genero" label="Género">
                <Select placeholder="Seleccionar género">
                  <Select.Option value="M">Masculino</Select.Option>
                  <Select.Option value="F">Femenino</Select.Option>
                  <Select.Option value="Otro">Otro</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </>
        )}

        {tipo === "MORAL" && (
          <>
            <Form.Item
              name="razon_social"
              label="Razón Social"
              rules={[{ required: true, message: "Ingresa la razón social" }]}
            >
              <Input placeholder="Ej: Empresa S.A. de C.V." />
            </Form.Item>

            <Form.Item
              name="identificacion_principal"
              label="Identificación corporativa (RUC / CIF / NIT)"
              rules={[{ required: true, message: "Ingresa la identificación" }]}
            >
              <Input placeholder="Ej: 123456789" />
            </Form.Item>
          </>
        )}
        </div>
      </Form>
    </Modal>
  );
};
