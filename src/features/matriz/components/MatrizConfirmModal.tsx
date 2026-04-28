import { Modal, Typography, Flex, Alert, Button } from "antd";
import { AlertTriangle, Save } from "lucide-react";

const { Title, Text } = Typography;

interface MatrizConfirmModalProps {
  open: boolean;
  changesCount: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const MatrizConfirmModal = ({
  open,
  changesCount,
  onConfirm,
  onCancel,
  loading,
}: MatrizConfirmModalProps) => {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onCancel}
      centered
      destroyOnClose
      width={520}
      title={
        <Flex align="center" gap="middle">
          <AlertTriangle size={24} style={{ color: "#faad14" }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Confirmar Cambios
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Revisa los cambios antes de guardar
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: 24 },
      }}
    >
      <Alert
        type="warning"
        showIcon
        message={`Estás a punto de guardar ${changesCount} cambio${changesCount !== 1 ? "s" : ""} en la matriz de permisos.`}
        description="Esta acción afectará los accesos de los usuarios en tiempo real. Los cambios tendrán efecto inmediato en todos los usuarios con esos roles."
        style={{ marginBottom: 24 }}
      />

      <Flex justify="end" gap="small">
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="primary"
          icon={<Save size={16} />}
          loading={loading}
          onClick={onConfirm}
        >
          Guardar Cambios
        </Button>
      </Flex>
    </Modal>
  );
};
