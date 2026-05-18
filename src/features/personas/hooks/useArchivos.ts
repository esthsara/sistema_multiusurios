// src/features/personas/hooks/useArchivos.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { archivosService } from "../services/archivos.service";
import type {
  ArchivoResource,
  TipoArchivo,
} from "../components/detalle/Archivo/archivo.constants";

export const useArchivos = (personaId: number) => {
  const [archivos, setArchivos] = useState<ArchivoResource[]>([]);
  const [papelera, setPapelera] = useState<ArchivoResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [restoring, setRestoring] = useState<number | null>(null);
  const [forceDeleting, setForceDeleting] = useState<number | null>(null);
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

  const fetchPapelera = useCallback(async () => {
    setLoadingTrash(true);
    try {
      const res = await archivosService.getTrashByPersona(personaId);
      setPapelera(res.items ?? []);
    } finally {
      setLoadingTrash(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
    fetchPapelera();
  }, [fetch, fetchPapelera]);

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
  };

  const handleRestore = async (id: number) => {
    setRestoring(id);
    try {
      await archivosService.restore(id);
      toast.success("Archivo restaurado");
      setPapelera((prev) => prev.filter((item) => item.id !== id));
      await fetch();
    } catch {
      toast.error("Error al restaurar archivo");
    } finally {
      setRestoring(null);
    }
  };

  const handleForceDelete = async (id: number) => {
    setForceDeleting(id);
    try {
      await archivosService.forceDelete(id);
      toast.success("Archivo eliminado permanentemente");
      setPapelera((prev) => prev.filter((item) => item.id !== id));
    } catch {
      toast.error("Error al eliminar permanentemente el archivo");
    } finally {
      setForceDeleting(null);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const link = document.createElement("a");
      link.href = archivosService.getDownloadUrl(id);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      toast.error("Error al descargar archivo");
    }
  };

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
    fetch,
    fetchPapelera,
    handleUpload,
    handleDelete,
    handleRestore,
    handleForceDelete,
    handleDownload,
  };
};
