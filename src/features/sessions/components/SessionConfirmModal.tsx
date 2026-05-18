import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";

interface SessionConfirmModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SessionConfirmModal = ({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: SessionConfirmModalProps) => {
  return (
    <ConfirmModal
      open={open}
      title="Cerrar todas las sesiones"
      description="Se cerrarán todas las sesiones activas. Esto desconectará a los usuarios en otros dispositivos. ¿Desea continuar?"
      confirmText="Cerrar sesiones"
      cancelText="Cancelar"
      loading={loading}
      danger
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};

export default SessionConfirmModal;
