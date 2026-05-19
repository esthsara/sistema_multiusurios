// src/features/personas/hooks/useArchivos.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { archivosService } from "../services/archivos.service";
import {
  downloadBlobUrl,
  getFileExtension,
  getResponseContentDisposition,
  resolveFileName,
  revokeBlobUrlLater,
  toBlobUrlFromResponse,
} from "@/shared/utils/file-download.utils";
import type {
  ArchivoResource,
  TipoArchivo,
} from "../components/detalle/Archivo/archivo.constants";


export const useArchivos = (personaId: number) => {
  const [archivos, setArchivos] = useState<ArchivoResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await archivosService.getByPersona(personaId);
      setArchivos(res.data.items ?? []);
    } catch {
      setError("Error al cargar archivos");
      toast.error("Error al cargar archivos");
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleUpload = async (
    file: File,
    tipo: TipoArchivo,
    nombre?: string,
    fechaExpiracion?: string,
  ) => {
    setUploading(true);
    try {
      await archivosService.upload({
        personaId,
        file,
        tipo,
        nombre,
        fechaExpiracion,
      });
      toast.success("Archivo subido");
      await fetch();
    } catch {
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await archivosService.remove(id);
      toast.success("Archivo eliminado");
      await fetch();
    } catch {
      toast.error("Error al eliminar archivo");
    } finally {
      setDeleting(null);
    }
  };
  // restore/force-delete removed — backend handles soft delete on remove

  const handleDownload = async (id: number) => {
    const item = archivos.find((archivo) => archivo.id === id);
    if (!item) return;

    const toastId = toast.loading("Preparando descarga...");
    try {
      const response = await archivosService.download(id);
      const extension = getFileExtension(item.extension, item.ruta, item.url);

      const { url } = toBlobUrlFromResponse(response, extension);
      const fileName = resolveFileName({
        contentDisposition: getResponseContentDisposition(response),
        fallbackName: item.nombre_original ?? item.nombre ?? "archivo",
        extension,
      });

      downloadBlobUrl({ blobUrl: url, fileName });
      revokeBlobUrlLater(url);
      toast.dismiss(toastId);
    } catch {
      toast.update(toastId, {
        render: "Error al descargar archivo",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return {
    archivos,
    loading,
    uploading,
    deleting,
    error,
    fetch,
    handleUpload,
    handleDelete,
    handleDownload,
  };
};
