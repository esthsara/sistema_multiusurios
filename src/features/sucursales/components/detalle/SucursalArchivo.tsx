import { useState } from "react";
import { Alert, Button } from "antd";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import { useSucursalArchivos } from "../../hooks/useSucursalArchivos";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";

import { ArchivoTable } from "./Archivo/ArchivoTable";
import { ArchivoFormModal } from "./Archivo/ArchivoFormModal";
import { ArchivoViewImage } from "./Archivo/ArchivoViewImage";
import {
  getArchivoDisplayName,
  isImageArchivo,
  isPdfArchivo,
  type ArchivoResource,
} from "./Archivo/archivo.constants";

export const SucursalArchivo = ({ sucursalId }: { sucursalId: number }) => {
  const {
    archivos,
    papelera,
    loading,
    loadingTrash,
    uploading,
    deleting,
    restoring,
    forceDeleting,
    error,
    handleUpload,
    handleDelete,
    handleRestore,
    handleForceDelete,
    handleDownload,
    getPublicUrl,
  } = useSucursalArchivos(sucursalId);

  const activeIds = new Set(archivos.map((item) => item.id));
  const papeleraVisible = papelera.filter((item) => !activeIds.has(item.id));

  const [viewMode, setViewMode] = useState<"activos" | "papelera">("activos");
  const [openForm, setOpenForm] = useState(false);
  const [previewItem, setPreviewItem] = useState<ArchivoResource | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ArchivoResource | null>(
    null,
  );
  const [restoreTarget, setRestoreTarget] = useState<ArchivoResource | null>(
    null,
  );
  const [forceDeleteTarget, setForceDeleteTarget] =
    useState<ArchivoResource | null>(null);

  const onSubmit = async (values: {
    file: File;
    tipo: string;
    nombre?: string;
    fechaExpiracion?: string;
  }) => {
    await handleUpload(
      values.file,
      values.tipo,
      values.nombre || "",
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

      const publicUrl =
        (await getPublicUrl(item.id)) || item.url || (item as any).ruta || "";
      if (isPdfArchivo(item)) {
        window.open(publicUrl, "_blank", "noopener,noreferrer");
        return;
      }

      window.open(publicUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("No se pudo previsualizar el archivo");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const confirmRestore = async () => {
    if (!restoreTarget) return;
    await handleRestore(restoreTarget.id);
    setRestoreTarget(null);
  };

  const confirmForceDelete = async () => {
    if (!forceDeleteTarget) return;
    await handleForceDelete(forceDeleteTarget.id);
    setForceDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Archivos</h3>

        <div className="flex gap-2">
          <Button
            type={viewMode === "activos" ? "primary" : "default"}
            onClick={() => setViewMode("activos")}
          >
            Activos
          </Button>
          <Button
            type={viewMode === "papelera" ? "primary" : "default"}
            icon={<Trash2 size={14} />}
            onClick={() => setViewMode("papelera")}
          >
            Papelera
          </Button>
          {viewMode === "activos" && (
            <Button icon={<Plus size={14} />} onClick={() => setOpenForm(true)}>
              Subir
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert type="error" showIcon message={error} className="mb-3" />
      )}

      <ArchivoTable
        data={viewMode === "activos" ? archivos : papeleraVisible}
        loading={viewMode === "activos" ? loading : loadingTrash}
        mode={viewMode}
        restoringId={restoring}
        forceDeletingId={forceDeleting}
        onView={handlePreview}
        onDownload={(item) => handleDownload(item.id)}
        onDelete={(item) => setDeleteTarget(item)}
        onRestore={(item) => setRestoreTarget(item)}
        onForceDelete={(item) => setForceDeleteTarget(item)}
      />

      <ArchivoFormModal
        open={openForm}
        loading={uploading}
        onCancel={() => setOpenForm(false)}
        onSubmit={onSubmit}
      />

      <ArchivoViewImage
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar archivo?"
        description={`Se eliminará "${getArchivoDisplayName(deleteTarget ?? { nombre_original: null, nombre: null })}".`}
        confirmText="Eliminar"
        loading={deleting === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!restoreTarget}
        title="¿Restaurar archivo?"
        description={`Se restaurará "${getArchivoDisplayName(restoreTarget ?? { nombre_original: null, nombre: null })}".`}
        confirmText="Restaurar"
        icon={<RotateCcw size={18} />}
        loading={restoring === restoreTarget?.id}
        onConfirm={confirmRestore}
        onCancel={() => setRestoreTarget(null)}
      />

      <ConfirmModal
        open={!!forceDeleteTarget}
        title="¿Eliminar permanentemente?"
        description={`"${getArchivoDisplayName(forceDeleteTarget ?? { nombre_original: null, nombre: null })}" se eliminará de forma permanente.`}
        confirmText="Eliminar permanente"
        danger
        loading={forceDeleting === forceDeleteTarget?.id}
        onConfirm={confirmForceDelete}
        onCancel={() => setForceDeleteTarget(null)}
      />
    </div>
  );
};
