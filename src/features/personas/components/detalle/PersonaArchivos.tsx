// src/features/personas/components/detalle/PersonaArchivos.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Table,
  Tooltip,
} from "antd";
import { Plus, Download, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import type { TableColumnsType } from "antd";
import { Can } from "@/shared/components/atoms/Can";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { archivosService } from "../../services/archivos.service";
import type { Archivo, TipoArchivo } from "../../types/persona-detalle.types";

const TIPO_OPTIONS: { value: TipoArchivo; label: string }[] = [
  { value: "CI", label: "CI" },
  { value: "CONTRATO", label: "Contrato" },
  { value: "CERTIFICADO", label: "Certificado" },
  { value: "FOTO", label: "Foto" },
  { value: "OTRO", label: "Otro" },
];

interface PersonaArchivosProps {
  personaId: number;
}

const getResolvedFileUrl = (rawUrl: string) => {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
  if (!apiBase) return rawUrl;

  const normalizedApi = apiBase.replace(/\/$/, "");
  const origin = normalizedApi.replace(/\/api(\/v\d+)?$/i, "");
  return `${origin}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};

const getFileExtensionFromMime = (mime: string | undefined) => {
  if (!mime) return "";
  const map: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mime.toLowerCase()] ?? "";
};

const getFilenameFromDisposition = (headerValue?: string) => {
  if (!headerValue) return null;

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(headerValue);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

  const asciiMatch = /filename="?([^";]+)"?/i.exec(headerValue);
  return asciiMatch?.[1] ?? null;
};

export const PersonaArchivos = ({ personaId }: PersonaArchivosProps) => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Archivo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form] = Form.useForm();

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

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      if (!values.archivo?.file) {
        toast.error("Selecciona un archivo");
        return;
      }
      setUploading(true);
      await archivosService.upload(
        personaId,
        values.archivo.file,
        values.tipo,
        values.nombre,
      );
      toast.success("Archivo subido correctamente");
      setModalOpen(false);
      form.resetFields();
      fetch();
    } catch {
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (archivo: Archivo) => {
    try {
      const res = await archivosService.download(archivo.id);
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const contentDisposition =
        (res.headers?.["content-disposition"] as string | undefined) ??
        undefined;
      const fromHeader = getFilenameFromDisposition(contentDisposition);
      const extension =
        getFileExtensionFromMime(blob.type) ||
        (archivo.url.match(/\.[a-z0-9]+$/i)?.[0] ?? "");
      const fallbackName =
        archivo.nombre && archivo.nombre.includes(".")
          ? archivo.nombre
          : `${archivo.nombre}${extension}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fromHeader ?? fallbackName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Error al descargar archivo");
    }
  };

  const handlePreview = async (archivo: Archivo) => {
    try {
      const maybeImageOrPdf = /\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(
        archivo.url,
      );

      if (maybeImageOrPdf) {
        const resolved = getResolvedFileUrl(archivo.url);
        window.open(resolved, "_blank", "noopener,noreferrer");
        return;
      }

      const res = await archivosService.download(archivo.id);
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      const previewUrl = window.URL.createObjectURL(blob);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(previewUrl), 60_000);
    } catch {
      toast.error("No se pudo previsualizar el archivo");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await archivosService.remove(deleteTarget.id);
      toast.success("Archivo eliminado");
      fetch();
    } catch {
      toast.error("Error al eliminar archivo");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: TableColumnsType<Archivo> = [
    {
      title: "Previsualizar",
      key: "preview",
      width: 100,
      render: (_, r) => (
        <Tooltip title="Previsualizar">
          <Button
            type="text"
            size="small"
            icon={<Eye size={15} />}
            onClick={() => handlePreview(r)}
          />
        </Tooltip>
      ),
    },
    { title: "Nombre", dataIndex: "nombre" },
    {
      title: "Tipo",
      key: "tipo",
      width: 100,
      render: (_, r) => r.tipo_texto,
    },
    {
      title: "Fecha subida",
      key: "fecha",
      width: 120,
      render: (_, r) => (
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {r.created_at.slice(0, 10)}
        </span>
      ),
    },
    {
      title: "Descargar",
      key: "descargar",
      width: 90,
      render: (_, record) => (
        <div className="flex gap-1">
          <Tooltip title="Descargar">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Can permission="personas.eliminar">
            <Tooltip title="Eliminar">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={14} />}
                onClick={() => setDeleteTarget(record)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Archivos
        </h3>
        <Can permission="personas.crear">
          <Button
            type="primary"
            size="small"
            icon={<Plus size={14} />}
            onClick={() => setModalOpen(true)}
          >
            Subir Archivo
          </Button>
        </Can>
      </div>

      <Table
        dataSource={archivos}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />

      <Modal
        open={modalOpen}
        title="Subir Archivo"
        onOk={handleUpload}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        okText="Subir"
        cancelText="Cancelar"
        okButtonProps={{ loading: uploading }}
        width={420}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-4"
        >
          <Form.Item
            name="nombre"
            label="Nombre del archivo"
            rules={[{ required: true, message: "Ingresa un nombre" }]}
          >
            <Input placeholder="Ej: CI de Juan Pérez" />
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo de documento"
            rules={[{ required: true, message: "Selecciona el tipo" }]}
          >
            <Select options={TIPO_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="archivo"
            label="Archivo"
            rules={[{ required: true, message: "Selecciona un archivo" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<Plus size={14} />}>Seleccionar archivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar este archivo?"
        description={`El archivo "${deleteTarget?.nombre}" será eliminado.`}
        confirmText="Eliminar"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
