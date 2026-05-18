// src/features/sucursales/hooks/useSucursalArchivos.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalArchivosService } from "../services/sucursal-archivos.service";
import type { SucursalArchivo } from "../types/sucursal.types";

export const useSucursalArchivos = (sucursalId: number) => {
  const [archivos, setArchivos] = useState<SucursalArchivo[]>([]);
  const [papelera, setPapelera] = useState<SucursalArchivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [restoring, setRestoring] = useState<number | null>(null);
  const [forceDeleting, setForceDeleting] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
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

  const fetchPapelera = useCallback(async () => {
    setLoadingTrash(true);
    try {
      const res = await sucursalArchivosService.getTrashBySucursal(sucursalId);
      setPapelera(res.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingTrash(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetch();
    void fetchPapelera();
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
        toast.success("Archivo eliminado correctamente");
        const deletedItem = archivos.find((item) => item.id === id);
        setArchivos((prev) => prev.filter((item) => item.id !== id));
        if (deletedItem) {
          setPapelera((prev) => [deletedItem, ...prev]);
        } else {
          await fetchPapelera();
        }
      } catch {
        toast.error("Error al eliminar archivo");
      } finally {
        setDeleting(null);
      }
    },
    [fetch],
  );

  const handleRestore = useCallback(
    async (id: number) => {
      setRestoring(id);
      try {
        await sucursalArchivosService.restore(id);
        toast.success("Archivo restaurado correctamente");
        setPapelera((prev) => prev.filter((item) => item.id !== id));
        await fetch();
      } catch {
        toast.error("Error al restaurar archivo");
      } finally {
        setRestoring(null);
      }
    },
    [fetch],
  );

  const handleForceDelete = useCallback(
    async (id: number) => {
      setForceDeleting(id);
      try {
        await sucursalArchivosService.forceDelete(id);
        toast.success("Archivo eliminado permanentemente");
        setPapelera((prev) => prev.filter((item) => item.id !== id));
      } catch {
        toast.error("Error al eliminar el archivo permanentemente");
      } finally {
        setForceDeleting(null);
      }
    },
    [fetch],
  );

  const handleDownload = useCallback(async (id: number) => {
    try {
      const link = document.createElement("a");
      link.href = sucursalArchivosService.getDownloadUrl(id);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      toast.error("Error al descargar archivo");
    }
  }, []);

  const getPublicUrl = useCallback(async (id: number) => {
    try {
      return await sucursalArchivosService.getPublicUrl(id);
    } catch {
      return "";
    }
  }, []);

  return {
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
  };
};
