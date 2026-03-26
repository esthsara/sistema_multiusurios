// src/features/personas/hooks/useArchivos.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { archivosService } from "../services/archivos.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type { Archivo } from "../types/persona-detalle.types";

export const useArchivos = (personaId: number) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const modal = useFormModal<Archivo>();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await archivosService.getByPersona(personaId);
      setArchivos(res.data.items);
    } catch {
      toast.error("Error al cargar archivos");
    } finally {
      setLoading(false);
    }
  }, [personaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleUpload = async (file: File, tipo: string, nombre: string) => {
    setUploading(true);
    try {
      await archivosService.upload(personaId, file, tipo, nombre);
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
      const res = await archivosService.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "archivo");
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
    modal,
    handleUpload,
    handleDelete,
    handleRestore,
    handleDownload,
  };
};
