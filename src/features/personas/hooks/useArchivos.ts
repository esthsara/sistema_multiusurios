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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await archivosService.getByPersona(personaId);
      setArchivos(res.data.items ?? []);
    } catch {
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
      fetch();
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
      fetch();
    } catch {
      toast.error("Error al eliminar archivo");
    } finally {
      setDeleting(null);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await archivosService.restore(id);
      toast.success("Archivo restaurado");
      fetch();
    } catch {
      toast.error("Error al restaurar archivo");
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
    loading,
    uploading,
    deleting,
    handleUpload,
    handleDelete,
    handleRestore,
    handleDownload,
  };
};
