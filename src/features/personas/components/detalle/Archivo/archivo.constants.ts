// src/features/personas/components/detalle/Archivo/archivo.constants.ts

import type { TableColumnsType } from "antd";


export const TipoArchivo = {
  CI: "CI",
  CONTRATO: "CONTRATO",
  CERTIFICADO: "CERTIFICADO",
  FOTO: "FOTO",
  OTRO: "OTRO",
} as const;

export type TipoArchivo = (typeof TipoArchivo)[keyof typeof TipoArchivo];

export interface ArchivoResource {
  id: number;
  persona_id?: number;
  nombre: string | null;
  nombre_original: string | null;
  ruta: string;
  url: string;
  tipo: TipoArchivo;
  tipo_texto: string;
  fecha_expiracion: string | null;
  mime_type?: string | null;
  extension?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateArchivoDto {
  persona_id: number;
  tipo: TipoArchivo;
  nombre?: string;
  fecha_expiracion?: string;
}

export const TIPO_OPTIONS = [
  { value: TipoArchivo.CI, label: "CI" },
  { value: TipoArchivo.CONTRATO, label: "Contrato" },
  { value: TipoArchivo.CERTIFICADO, label: "Certificado" },
  { value: TipoArchivo.FOTO, label: "Foto" },
  { value: TipoArchivo.OTRO, label: "Otro" },
];

export const MAX_ARCHIVO_SIZE_MB = 10;
export const MAX_ARCHIVO_SIZE_BYTES = MAX_ARCHIVO_SIZE_MB * 1024 * 1024;

export const getArchivoDisplayName = (
  archivo: Pick<ArchivoResource, "nombre_original" | "nombre">,
) => archivo.nombre_original?.trim() || archivo.nombre?.trim() || "Sin nombre";

export const isImageArchivo = (
  archivo: Pick<ArchivoResource, "tipo" | "url" | "extension" | "mime_type">,
) => {
  const extension = (archivo.extension ?? archivo.url.split(".").pop() ?? "")
    .toLowerCase()
    .split("?")[0];
  const mimeType = (archivo.mime_type ?? "").toLowerCase();

  return (
    archivo.tipo === TipoArchivo.FOTO ||
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(extension) ||
    mimeType.startsWith("image/")
  );
};

export const isPdfArchivo = (
  archivo: Pick<ArchivoResource, "url" | "extension" | "mime_type">,
) => {
  const extension = (archivo.extension ?? archivo.url.split(".").pop() ?? "")
    .toLowerCase()
    .split("?")[0];
  const mimeType = (archivo.mime_type ?? "").toLowerCase();

  return extension === "pdf" || mimeType === "application/pdf";
};



export const ARCHIVO_BASE_COLUMNS: TableColumnsType<ArchivoResource> = [
  {
    title: "Nombre",
    key: "nombre",
    dataIndex: "nombre_original",
    render: (_, archivo) => getArchivoDisplayName(archivo),
  },
  {
    title: "Tipo",
    key: "tipo",
    dataIndex: "tipo_texto",
    width: 130,
  },
  {
    title: "Vence",
    key: "fecha_expiracion",
    width: 120,
    render: (_, archivo) =>
      archivo.fecha_expiracion ? archivo.fecha_expiracion.slice(0, 10) : "—",
  },
  {
    title: "Subido",
    key: "created_at",
    width: 120,
    render: (_, archivo) => archivo.created_at.slice(0, 10),
  },
];
