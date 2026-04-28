import { Form, Input, Modal, Alert, Typography, Flex } from "antd";
import { useEffect } from "react";
import { Copy, FileText, AlertCircle } from "lucide-react";
import { Button } from "antd";

const { Title, Text } = Typography;

interface RoleCopyModalProps {
  open: boolean;
  sourceRoleName?: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (newName: string) => Promise<void> | void;
}

export const RoleCopyModal = ({
  open,
  sourceRoleName,
  loading,
  onCancel,
  onConfirm,
}: RoleCopyModalProps) => {
  const [form] = Form.useForm<{ newName: string }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        newName: sourceRoleName ? `Copia de ${sourceRoleName}` : "Copia Rol",
      });
    }
  }, [open, sourceRoleName, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onConfirm(values.newName.trim());
      form.resetFields();
    } catch {
      // validación
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={handleCancel}
      width={640}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap="middle">
          <Copy size={24} style={{ color: "var(--ant-color-primary)" }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Copiar rol
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Duplica un rol existente con todos sus permisos
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div style={{ padding: 24 }}>
        <Alert
          type="info"
          showIcon
          icon={<AlertCircle size={16} />}
          message="Clonación de rol"
          description={
            <Text>
              Se creará una copia de{" "}
              <Text strong>“{sourceRoleName ?? "este rol"}”</Text> incluyendo
              todos sus permisos y configuración actual.
            </Text>
          }
          style={{ marginBottom: 24, borderRadius: 8 }}
        />

        <Form form={form} layout="vertical" requiredMark={false} size="middle">
          <Form.Item
            name="newName"
            label={
              <Flex align="center" gap={6}>
                <FileText size={14} />
                <Text>Nuevo nombre del rol</Text>
              </Flex>
            }
            rules={[
              { required: true, message: "Ingresa el nombre del nuevo rol" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
              {
                validator: (_, value) => {
                  if (!value || !value.trim()) {
                    return Promise.reject("El nombre no puede estar vacío");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              maxLength={90}
              placeholder="Ej: Copia Administrador"
              autoFocus
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>

        <Flex justify="end" gap="small" style={{ marginTop: 24 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="primary" loading={loading} onClick={handleOk}>
            Crear copia
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
