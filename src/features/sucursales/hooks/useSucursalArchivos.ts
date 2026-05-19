// src/features/sucursales/hooks/useSucursalArchivos.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalArchivosService } from "../services/sucursal-archivos.service";
import {
  downloadBlobUrl,
  getFileExtension,
  getResponseContentDisposition,
  resolveFileName,
  revokeBlobUrlLater,
  toBlobUrlFromResponse,
} from "@/shared/utils/file-download.utils";
import type { SucursalArchivo } from "../types/sucursal.types";

export const useSucursalArchivos = (sucursalId: number) => {
  const [archivos, setArchivos] = useState<SucursalArchivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sucursalArchivosService.getBySucursal(sucursalId);
      setArchivos(res.data.items ?? []);
    } catch {
      setError("Error al cargar archivos de sucursal");
      toast.error("Error al cargar archivos de sucursal");
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleUpload = useCallback(
    async (
      file: File,
      tipo: string,
      nombre: string,
      fecha_expiracion?: string,
    ) => {
      setUploading(true);
      try {
        await sucursalArchivosService.upload(
          sucursalId,
          file,
          nombre,
          tipo,
          fecha_expiracion,
        );
        toast.success("Archivo subido correctamente");
        await fetch();
      } catch {
        toast.error("Error al subir archivo");
      } finally {
        setUploading(false);
      }
    },
    [sucursalId, fetch],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setDeleting(id);
      try {
        await sucursalArchivosService.remove(id);
        toast.success("Archivo eliminado");
        await fetch();
      } catch {
        toast.error("Error al eliminar archivo");
      } finally {
        setDeleting(null);
      }
    },
    [fetch],
  );

  const handleDownload = useCallback(
    async (id: number) => {
      const item = archivos.find((archivo) => archivo.id === id);
      if (!item) return;

      const toastId = toast.loading("Preparando descarga...");
      try {
        const response = await sucursalArchivosService.download(id);
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
    },
    [archivos],
  );

  const getPublicUrl = useCallback(async (id: number) => {
    try {
      return await sucursalArchivosService.getPublicUrl(id);
    } catch {
      return "";
    }
  }, []);

  return {
    archivos,
    loading,
    uploading,
    deleting,
    error,
    handleUpload,
    handleDelete,
    handleDownload,
    getPublicUrl,
  };
};
