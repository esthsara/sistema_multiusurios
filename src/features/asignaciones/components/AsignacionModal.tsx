import { useState, useCallback } from "react";
import { Modal, Form, Select, Spin, Typography, Avatar } from "antd";
import { UserPlus, Building2, Hash } from "lucide-react";
import type { ModalProps } from "antd";

interface AsignacionModalProps extends Omit<ModalProps, "children"> {
  usuarios: Array<{ id: number; username: string; email: string }>;
  loading?: boolean;
  sucursal?: { id: number; nombre: string; codigo: string };
  onSubmit?: (data: { usuario_id: number }) => Promise<void>;
}

const { Text } = Typography;

export const AsignacionModal = ({
  usuarios,
  loading = false,
  sucursal,
  onSubmit,
  ...modalProps
}: AsignacionModalProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await onSubmit?.(values);
      form.resetFields();
    } catch {
      // Validación fallida, Ant Design maneja el feedback
    } finally {
      setSubmitting(false);
    }
  }, [form, onSubmit]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    // Pasar el evento como lo espera Ant Design Modal
    if (modalProps.onCancel) {
      modalProps.onCancel(new MouseEvent("cancel") as any);
    }
  }, [form, modalProps]);

  /* Estilos reutilizables */
  const iconBoxStyle = {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "var(--color-primary-light, #e6f4ff)",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  return (
    <Modal
      {...modalProps}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={iconBoxStyle}>
            <UserPlus size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
              Asignar Usuario
            </div>
            {sucursal && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  fontWeight: 400,
                }}
              >
                {sucursal.nombre}
              </div>
            )}
          </div>
        </div>
      }
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserPlus size={14} /> Asignar
        </span>
      }
      cancelText="Cancelar"
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={520}
      centered
      okButtonProps={{ loading: submitting }}
      cancelButtonProps={{ disabled: submitting }}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {/* Info de la sucursal */}
        {sucursal && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 8,
              backgroundColor: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              marginBottom: 20,
              marginTop: 4,
            }}
          >
            <div
              style={{
                ...iconBoxStyle,
                width: 40,
                height: 40,
              }}
            >
              <Building2 size={20} style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <Text strong style={{ display: "block", fontSize: 14 }}>
                {sucursal.nombre}
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <Hash
                  size={11}
                  style={{ color: "var(--color-text-secondary)" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {sucursal.codigo}
                </Text>
              </div>
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="usuario_id"
            label={<span style={{ fontWeight: 500 }}>Seleccionar Usuario</span>}
            rules={[{ required: true, message: "Selecciona un usuario" }]}
          >
            <Select
              showSearch
              placeholder="Buscar por nombre o email..."
              optionFilterProp="label"
              size="large"
              disabled={loading}
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) ?? false
              }
              optionRender={(opt) => {
                const usuario = usuarios.find((u) => u.id === opt.value);
                if (!usuario) return opt.label;

                const initials = usuario.username.charAt(0).toUpperCase();

                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "2px 0",
                    }}
                  >
                    <Avatar
                      size={28}
                      style={{
                        backgroundColor: "#4ECDC4",
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        @{usuario.username}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {usuario.email}
                      </div>
                    </div>
                  </div>
                );
              }}
              options={usuarios.map((u) => ({
                value: u.id,
                label: `${u.username} ${u.email}`,
              }))}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AsignacionModal;
