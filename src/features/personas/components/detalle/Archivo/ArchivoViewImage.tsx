// ArchivoViewImage.tsx

import { useEffect, useState } from "react";
import { Button, ConfigProvider, Modal, Spin, theme } from "antd";
import { Image as ImageIcon } from "lucide-react";

import { archivosService } from "../../../services/archivos.service";
import {
  getArchivoDisplayName,
  type ArchivoResource,
} from "./archivo.constants";

interface Props {
  open: boolean;
  item: ArchivoResource | null;
  onClose: () => void;
}

export const ArchivoViewImage = ({ open, item, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    if (!open || !item) {
      setPublicUrl("");
      return;
    }

    let mounted = true;
    setLoading(true);

    void archivosService
      .getPublicUrl(item.id)
      .then((url) => {
        if (mounted) setPublicUrl(url);
      })
      .catch(() => {
        if (mounted) setPublicUrl(item.url);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [item, open]);

  if (!item) return null;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorBgElevated: "var(--color-bg-base)" },
      }}
    >
      <Modal
        open={open}
        footer={null}
        onCancel={onClose}
        width={860}
        centered
        destroyOnHidden
      >
        <div className="pt-3">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
              <ImageIcon size={16} className="text-blue-400" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Previsualizar archivo
              </h3>
              <p
                className="text-xs m-0"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {getArchivoDisplayName(item)}
              </p>
            </div>
          </div>

          <div className="min-h-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex items-center justify-center overflow-hidden">
            {loading ? (
              <Spin />
            ) : publicUrl ? (
              <img
                src={publicUrl}
                alt={getArchivoDisplayName(item)}
                className="max-h-[70vh] max-w-full object-contain"
              />
            ) : (
              <div className="text-center px-6 py-10">
                <p
                  className="m-0"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  No se pudo cargar la imagen.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <Button
              block
              onClick={onClose}
              className="rounded-lg h-10 font-medium"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
