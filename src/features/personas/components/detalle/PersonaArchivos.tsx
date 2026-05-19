import { useState } from "react";
import { Alert, Button } from "antd";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Can } from "@/shared/components/guards/Can";
import {
  downloadBlobUrl,
  getFileExtension,
  getResponseContentDisposition,
  resolveFileName,
  revokeBlobUrlLater,
  toBlobUrlFromResponse,
  tryOpenBlobInNewTab,
} from "@/shared/utils/file-download.utils";

import { useArchivos } from "../../hooks/useArchivos";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { archivosService } from "../../services/archivos.service";

import { ArchivoTable } from "./Archivo/ArchivoTable";
import { ArchivoViewImage } from "./Archivo/ArchivoViewImage";
import { ArchivoFormModal } from "./Archivo/ArchivoFormModal";
import {
  getArchivoDisplayName,
  isImageArchivo,
  isPdfArchivo,
  type ArchivoResource,
} from "./Archivo/archivo.constants";

export const PersonaArchivos = ({ personaId }: { personaId: number }) => {
  const {
    archivos,
    loading,
    uploading,
    deleting,
    error,
    handleUpload,
    handleDelete,
    handleDownload,
  } = useArchivos(personaId);

  const [openForm, setOpenForm] = useState(false);
  const [previewItem, setPreviewItem] = useState<ArchivoResource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArchivoResource | null>(
    null,
  );

  const onSubmit = async (values: {
    file: File;
    tipo: ArchivoResource["tipo"];
    nombre?: string;
    fechaExpiracion?: string;
  }) => {
    await handleUpload(
      values.file,
      values.tipo,
      values.nombre,
      values.fechaExpiracion,
    );
    setOpenForm(false);
  };

  const handlePreview = async (item: ArchivoResource) => {
    try {
      if (isImageArchivo(item)) {
        setPreviewItem(item);
        return;
      }

      const toastId = toast.loading("Abriendo archivo...");
      const response = await archivosService.download(item.id);
      const extension = getFileExtension(item.extension, item.ruta, item.url);
      const { url } = toBlobUrlFromResponse(response, extension);
      const fileName = resolveFileName({
        contentDisposition: getResponseContentDisposition(response),
        fallbackName: item.nombre_original ?? item.nombre ?? "archivo",
        extension,
      });

      if (isPdfArchivo(item)) {
        if (!tryOpenBlobInNewTab(url)) {
          downloadBlobUrl({ blobUrl: url, fileName });
        }
      } else {
        downloadBlobUrl({ blobUrl: url, fileName });
      }

      revokeBlobUrlLater(url);
      toast.dismiss(toastId);
    } catch {
      toast.error("No se pudo previsualizar el archivo");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Archivos</h3>

        <div className="flex gap-2">
          <Can permission="archivos.subir">
            <Button icon={<Plus size={14} />} onClick={() => setOpenForm(true)}>
              Subir
            </Button>
          </Can>
        </div>
      </div>

      {error && (
        <Alert type="error" showIcon message={error} className="mb-3" />
      )}

      {/* TABLE */}
      <ArchivoTable
        data={archivos}
        loading={loading}
        onView={handlePreview}
        onDownload={(item) => handleDownload(item.id)}
        onDelete={(item) => setDeleteTarget(item)}
      />

      {/* MODAL UPLOAD */}
      <ArchivoFormModal
        open={openForm}
        loading={uploading}
        onCancel={() => setOpenForm(false)}
        onSubmit={onSubmit}
      />

      {/* PREVIEW */}
      <ArchivoViewImage
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar archivo"
        description={`Se eliminará "${getArchivoDisplayName(deleteTarget ?? { nombre_original: null, nombre: null })}". Esta acción no se puede deshacer desde la interfaz.`}
        confirmText="Eliminar"
        danger
        loading={deleting === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
