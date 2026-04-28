import { Descriptions, Modal, Spin, Tag } from "antd";
import type { AuditoriaDetalle } from "../types/auditoria.types";

interface AuditoriaDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: AuditoriaDetalle | null;
  onClose: () => void;
}

const renderChanges = (cambios: AuditoriaDetalle["diferencias"]) => {
  if (!cambios || Object.keys(cambios).length === 0) {
    return <span>—</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 🔹 HEADER */}
      <div
        className="grid grid-cols-3 px-3 py-1 text-[11px] font-semibold"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <span>Campo</span>
        <span className="text-center">Antes</span>
        <span className="text-center">Ahora</span>
      </div>

      {/* 🔹 FILAS */}
      {Object.entries(cambios).map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-3 items-center gap-2 px-3 py-2 rounded-md"
          style={{
            background: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* CAMPO */}
          <span
            className="text-xs font-medium truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {key.replace(/_/g, " ")}
          </span>

          {/* ANTES */}
          <span
            className="text-xs px-2 py-1 rounded text-center truncate"
            style={{
              background:
                "color-mix(in srgb, var(--color-danger-500) 12%, transparent)",
              color: "var(--color-danger-600)",
            }}
          >
            {String(value.anterior ?? "—")}
          </span>

          {/* AHORA */}
          <span
            className="text-xs px-2 py-1 rounded text-center truncate"
            style={{
              background:
                "color-mix(in srgb, var(--color-success-500) 12%, transparent)",
              color: "var(--color-success-600)",
            }}
          >
            {String(value.nuevo ?? "—")}
          </span>
        </div>
      ))}
    </div>
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
      centered
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
            <Descriptions.Item label="IP">{detail.ip || "-"}</Descriptions.Item>
            <Descriptions.Item label="Fecha completa">
              {detail.fecha_completa}
            </Descriptions.Item>
            <Descriptions.Item label="User Agent" span={2}>
              {detail.user_agent || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Cambios realizados" span={2}>
              {renderChanges(detail.diferencias)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </Modal>
  );
};
