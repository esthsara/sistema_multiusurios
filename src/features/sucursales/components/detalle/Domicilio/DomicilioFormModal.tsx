import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  ConfigProvider,
  theme,
} from "antd";
import { useEffect } from "react";
import {
  TIPO_OPTIONS,
  type Domicilio,
  type CreateDomicilioDto,
  type UpdateDomicilioDto,
} from "./domicilio.constants";

interface Props {
  open: boolean;
  isEdit: boolean;
  loading: boolean;
  item?: Domicilio | null;
  onSubmit: (values: CreateDomicilioDto | UpdateDomicilioDto) => void;
  onCancel: () => void;
}

interface DomicilioFormValues {
  tipo: Domicilio["tipo"];
  pais: string;
  ciudad: string;
  direccion: string;
  codigo_postal?: string;
  principal?: boolean;
}

export const DomicilioFormModal = ({
  open,
  isEdit,
  loading,
  item,
  onSubmit,
  onCancel,
}: Props) => {
  const [form] = Form.useForm<DomicilioFormValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        item
          ? {
              tipo: item.tipo,
              pais: item.pais,
              ciudad: item.ciudad,
              direccion: item.direccion,
              codigo_postal: item.codigo_postal ?? undefined,
              principal: item.principal,
            }
          : {
              tipo: "FISCAL",
              pais: "",
              ciudad: "",
              direccion: "",
              codigo_postal: "",
              principal: false,
            },
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
        forceRender
        title={
          <div className="pb-2">
            <h3
              style={{
                color: "var(--color-text-primary)",
                margin: 0,
                fontSize: "18px",
              }}
            >
              {isEdit ? "Editar domicilio" : "Nuevo domicilio"}
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
                ? "Modifica los datos del domicilio seleccionado"
                : "Agrega una nueva dirección"}
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
        okText={isEdit ? "Guardar cambios" : "Crear domicilio"}
        cancelText="Cancelar"
        confirmLoading={loading}
        width={480}
        centered
        destroyOnHidden
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
          className="mt-6"
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="tipo"
              label="Tipo"
              rules={[{ required: true, message: "Selecciona el tipo" }]}
            >
              <Select options={TIPO_OPTIONS} placeholder="Seleccionar tipo" />
            </Form.Item>

            <Form.Item
              name="pais"
              label="País"
              rules={[{ required: true, message: "Ingresa el país" }]}
            >
              <Input placeholder="Ej: Bolivia" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="ciudad"
              label="Ciudad"
              rules={[{ required: true, message: "Ingresa la ciudad" }]}
            >
              <Input placeholder="Ej: Santa Cruz" />
            </Form.Item>

            <Form.Item name="codigo_postal" label="Código Postal">
              <Input placeholder="Ej: 12345" />
            </Form.Item>
          </div>

          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: "Ingresa la dirección" }]}
          >
            <Input placeholder="Ej: Av. Principal #123" />
          </Form.Item>

          <Form.Item
            name="principal"
            label="¿Es principal?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
