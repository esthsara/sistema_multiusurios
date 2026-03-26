// src/features/sucursales/hooks/useSucursalArchivos.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sucursalArchivosService } from "../services/sucursal-archivos.service";
import type { SucursalArchivo } from "../types/sucursal.types";

export const useSucursalArchivos = (sucursalId: number) => {
  const [archivos, setArchivos] = useState<SucursalArchivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sucursalArchivosService.getBySucursal(sucursalId);
      setArchivos(res.data.items ?? []);
    } catch {
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
        toast.success("Archivo eliminado correctamente");
        await fetch();
      } catch {
        toast.error("Error al eliminar archivo");
      } finally {
        setDeleting(null);
      }
    },
    [fetch],
  );

  const handleDownload = useCallback(async (id: number) => {
    try {
      const response = await sucursalArchivosService.download(id);
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `archivo-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      toast.error("Error al descargar archivo");
    }
  }, []);

  return {
    archivos,
    loading,
    uploading,
    deleting,
    handleUpload,
    handleDelete,
    handleDownload,
  };
};
