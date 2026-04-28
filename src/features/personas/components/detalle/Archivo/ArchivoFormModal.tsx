import { useEffect } from "react";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  theme,
} from "antd";
import type { Dayjs } from "dayjs";
import { Plus } from "lucide-react";

import {
  MAX_ARCHIVO_SIZE_BYTES,
  MAX_ARCHIVO_SIZE_MB,
  TIPO_OPTIONS,
  type TipoArchivo,
} from "./archivo.constants";

interface ArchivoFormValues {
  nombre?: string;
  tipo: TipoArchivo;
  fecha_expiracion?: Dayjs | null;
  archivo?: { fileList?: Array<{ originFileObj?: File }> };
}

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    tipo: TipoArchivo;
    nombre?: string;
    fechaExpiracion?: string;
    file: File;
  }) => void;
}

export const ArchivoFormModal = ({
  open,
  loading,
  onCancel,
  onSubmit,
}: Props) => {
  const [form] = Form.useForm<ArchivoFormValues>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const selectedFile = values.archivo?.fileList?.[0]?.originFileObj;

    if (!(selectedFile instanceof File)) {
      return;
    }

    await onSubmit({
      tipo: values.tipo,
      nombre: values.nombre?.trim() || undefined,
      fechaExpiracion: values.fecha_expiracion
        ? values.fecha_expiracion.format("YYYY-MM-DD")
        : undefined,
      file: selectedFile,
    });
    form.resetFields();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorBgElevated: "var(--color-bg-base-2)" },
      }}
    >
      <Modal
        open={open}
        title="Subir archivo"
        onOk={handleOk}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        okText="Subir"
        confirmLoading={loading}
        width={720}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="tipo"
              label="Tipo de archivo"
              rules={[{ required: true, message: "Selecciona el tipo" }]}
            >
              <Select options={TIPO_OPTIONS} placeholder="Seleccionar tipo" />
            </Form.Item>

            <Form.Item name="nombre" label="Nombre">
              <Input placeholder="Ej: Identificación de Juan" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item name="fecha_expiracion" label="Fecha de expiración">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="archivo"
              label="Archivo"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : (e?.fileList ?? [])
              }
              rules={[
                { required: true, message: "Selecciona un archivo" },
                {
                  validator: async (
                    _,
                    value: Array<{ originFileObj?: File }>,
                  ) => {
                    const file = value?.[0]?.originFileObj;
                    if (!(file instanceof File)) {
                      return Promise.reject(new Error("Selecciona un archivo"));
                    }
                    if (file.size > MAX_ARCHIVO_SIZE_BYTES) {
                      return Promise.reject(
                        new Error(
                          `El archivo no puede superar ${MAX_ARCHIVO_SIZE_MB}MB`,
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept="*/*">
                <Button icon={<Plus size={14} />}>Seleccionar archivo</Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
