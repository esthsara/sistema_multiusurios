import { Descriptions, Modal, Spin, Tag } from "antd";
import type { AuditoriaDetalle } from "../types/auditoria.types";

interface AuditoriaDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: AuditoriaDetalle | null;
  onClose: () => void;
}

const renderJson = (value: unknown) => {
  if (value === null || value === undefined) return "—";
  return (
    <pre className="m-0 text-xs whitespace-pre-wrap">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export const AuditoriaDetailModal = ({
  open,
  loading,
  detail,
  onClose,
}: AuditoriaDetailModalProps) => {
  return (
    <Modal
      open={open}
      title="Detalle de auditoría"
      onCancel={onClose}
      footer={null}
      width={980}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {detail && (
          <Descriptions column={2} bordered size="small" className="mt-3">
            <Descriptions.Item label="ID">{detail.id}</Descriptions.Item>
            <Descriptions.Item label="Acción">
              <Tag color="blue">{detail.accion}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Usuario">
              {detail.usuario.nombre}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {detail.usuario.email}
            </Descriptions.Item>
            <Descriptions.Item label="Entidad">
              {detail.entidad_nombre}
            </Descriptions.Item>
            <Descriptions.Item label="Entidad ID">
              {detail.entidad_id}
            </Descriptions.Item>
            <Descriptions.Item label="IP">{detail.ip || "—"}</Descriptions.Item>
            <Descriptions.Item label="Fecha completa">
              {detail.fecha_completa}
            </Descriptions.Item>
            <Descriptions.Item label="User Agent" span={2}>
              {detail.user_agent || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Valores anteriores" span={2}>
              {renderJson(detail.valores_anteriores)}
            </Descriptions.Item>

            <Descriptions.Item label="Valores nuevos" span={2}>
              {renderJson(detail.valores_nuevos)}
            </Descriptions.Item>

            <Descriptions.Item label="Diferencias" span={2}>
              {renderJson(detail.diferencias)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </Modal>
  );
};
