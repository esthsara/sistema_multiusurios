import { Modal, Button } from "antd";

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
      title="Confirmar Cambios"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onConfirm}
        >
          Guardar Cambios
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4">
        <p>
          <strong>
            Estás a punto de guardar {changesCount} cambios en la matriz de
            permisos.
          </strong>
        </p>
        <p>Esta acción afectará los accesos de los usuarios en tiempo real.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
          <p className="text-sm">
            Los cambios tendrán efecto inmediato en todos los usuarios con esos
            roles.
          </p>
        </div>
      </div>
    </Modal>
  );
};
