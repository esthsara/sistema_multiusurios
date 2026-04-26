import { Modal, Form, Input, Select, ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import {
  TIPO_OPTIONS,
  PLACEHOLDERS,
  type Contacto,
  type CreateContactoDto,
  type UpdateContactoDto,
  type ContactoFormValues,
} from "./contacto.constants";

interface Props {
  open: boolean;
  isEdit: boolean;
  loading: boolean;
  item?: Contacto | null;
  onSubmit: (values: CreateContactoDto | UpdateContactoDto) => void;
  onCancel: () => void;
}



export const ContactoFormModal = ({
  open,
  isEdit,
  loading,
  item,
  onSubmit,
  onCancel,
}: Props) => {
  const [form] = Form.useForm<ContactoFormValues>();

  const tipoSeleccionado = Form.useWatch("tipo", form);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        item ? { tipo: item.tipo, valor: item.valor } : { tipo: "EMAIL" },
      );
    } else {
      form.resetFields();
    }
  }, [form, item, open]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "var(--color-bg-base-2)",
        },
      }}
    >
      <Modal
        open={open}
        title={
          <div className="pb-2">
            <h3
              style={{
                color: "var(--color-text-primary)",
                margin: 0,
                fontSize: "18px",
              }}
            >
              {isEdit ? "Editar contacto" : "Nuevo contacto"}
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "12px",
                fontWeight: 400,
                margin: 0,
              }}
            >
              {isEdit
                ? "Modifica los datos del contacto seleccionado"
                : "Agrega un nuevo medio de comunicación"}
            </p>
          </div>
        }
        onOk={async () => {
          try {
            const values = await form.validateFields();
            onSubmit(values);
          } catch {
            /* validación antd */
          }
        }}
        onCancel={onCancel}
        okText={isEdit ? "Guardar cambios" : "Crear contacto"}
        cancelText="Cancelar"
        confirmLoading={loading}
        width={480}
        centered
        destroyOnHidden
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(4px)",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
          className="mt-6"
          requiredMark={true}
        >
          <Form.Item
            name="tipo"
            label={
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "13px",
                }}
              >
                Tipo de contacto
              </span>
            }
            rules={[{ required: true, message: "Selecciona un tipo" }]}
          >
            <Select options={TIPO_OPTIONS} placeholder="Seleccionar tipo" />
          </Form.Item>

          <Form.Item
            name="valor"
            label={
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "13px",
                }}
              >
                Valor del contacto
              </span>
            }
            rules={[
              { required: true, message: "El valor es requerido" },
              {
                type: tipoSeleccionado === "EMAIL" ? "email" : "string",
                message: "Por favor ingresa un correo válido",
              },
            ]}
          >
            <Input
              placeholder={
                tipoSeleccionado
                  ? PLACEHOLDERS[tipoSeleccionado]
                  : "Ingresa el valor"
              }
              className="rounded-lg"
              style={{
                backgroundColor: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
