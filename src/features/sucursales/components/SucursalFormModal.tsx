// src/features/sucursales/components/SucursalFormModal.tsx
import { Form, Input, Modal, Switch, Upload, Button } from "antd";
import { useEffect, useState } from "react";
import { Store, ImagePlus, Info, Clock, MapPin } from "lucide-react";
import type {
  CreateSucursalDto,
  SucursalListItem,
  UpdateSucursalDto,
} from "../types/sucursal.types";
import {
  VALIDATION_RULES,
  DEFAULT_VALUES,
} from "@/features/sucursales/utils/sucursal.utils";

interface SucursalFormModalProps {
  open: boolean;
  selectedItem?: SucursalListItem | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: CreateSucursalDto | UpdateSucursalDto) => void;
  onCancel: () => void;
}

interface FormValues {
  nombre: string;
  codigo: string;
  email: string;
  direccion: string;
  descripcion?: string;
  horario_apertura: string;
  horario_cierre: string;
  activa: boolean;
  logo?: File;
}

export const SucursalFormModal = ({
  open,
  selectedItem,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}: SucursalFormModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      RESET/POPULATE FORM (Lógica intacta) */
  useEffect(() => {
    if (!open) {
      setLogoFile(null);
      return;
    }

    if (isEditMode && selectedItem) {
      form.setFieldsValue({
        nombre: selectedItem.nombre,
        codigo: selectedItem.codigo,
        email: selectedItem.email,
        direccion: selectedItem.direccion,
        descripcion: selectedItem.descripcion ?? "",
        horario_apertura:
          selectedItem.horario_apertura ?? DEFAULT_VALUES.HORA_APERTURA,
        horario_cierre:
          selectedItem.horario_cierre ?? DEFAULT_VALUES.HORA_CIERRE,
        activa: selectedItem.activa,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      activa: DEFAULT_VALUES.ESTADO_ACTIVO,
      horario_apertura: DEFAULT_VALUES.HORA_APERTURA,
      horario_cierre: DEFAULT_VALUES.HORA_CIERRE,
    });
  }, [open, isEditMode, selectedItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        ...(logoFile ? { logo: logoFile } : {}),
      });
    } catch {}
  };

  const handleUpload = (file: File) => {
    setLogoFile(file);
    return false;
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
  };

  const title = isEditMode ? "Editar Sucursal" : "Nueva Sucursal";

  return (
    <Modal
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={isEditMode ? "Guardar cambios" : "Crear sucursal"}
      cancelText="Cancelar"
      okButtonProps={{ loading: isSubmitting }}
      cancelButtonProps={{ disabled: isSubmitting }}
      width={640}
      centered
      destroyOnHidden
      title={null}
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        },
      }}
    >
      {/* HEADER COMPACTO */}
      <div className="px-8 pt-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <Store size={22} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] m-0">
              {title}
            </h3>
            <p className="text-[12px] text-[var(--color-text-secondary)] opacity-70 m-0">
              {isEditMode
                ? "Actualiza la información operativa de la sede."
                : "Registra una nueva ubicación para la empresa."}
            </p>
          </div>
        </div>
      </div>

      {/* FORMULARIO */}
      <Form<FormValues>
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        className="px-8 pt-6 pb-8"
        autoComplete="off"
        disabled={isSubmitting}
      >
        <div className="space-y-6">
          {/* SECCIÓN 1: IDENTIFICACIÓN Y CONTACTO */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <Form.Item
              name="nombre"
              label={
                <span className="text-sm font-medium">
                  Nombre de la Sucursal
                </span>
              }
              rules={VALIDATION_RULES.required("El nombre")}
              className="m-0"
            >
              <Input placeholder="Ej: Central El Alto" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="codigo"
              label={
                <span className="text-sm font-medium">Código Interno</span>
              }
              rules={VALIDATION_RULES.required("El código")}
              className="m-0"
            >
              <Input
                placeholder="Ej: SC-001"
                disabled={isEditMode}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className="text-sm font-medium">Email de Contacto</span>
              }
              rules={VALIDATION_RULES.email()}
              className="m-0 col-span-2 md:col-span-1"
            >
              <Input
                placeholder="sucursal@ejemplo.com"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="direccion"
              label={<span className="text-sm font-medium">Dirección</span>}
              rules={VALIDATION_RULES.required("La dirección")}
              className="m-0 col-span-2 md:col-span-1"
            >
              <Input
                prefix={<MapPin size={14} className="text-gray-400 mr-1" />}
                placeholder="Av. 6 de Marzo..."
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* SECCIÓN 2: OPERACIÓN */}
          <div className="grid grid-cols-2 gap-x-5 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/20">
            <Form.Item
              name="horario_apertura"
              label={
                <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                  <Clock size={12} /> Apertura
                </span>
              }
              rules={VALIDATION_RULES.time("La hora")}
              className="m-0"
            >
              <Input
                placeholder="08:00"
                className="rounded-lg border-none shadow-none bg-transparent"
              />
            </Form.Item>

            <Form.Item
              name="horario_cierre"
              label={
                <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                  <Clock size={12} /> Cierre
                </span>
              }
              rules={VALIDATION_RULES.time("La hora")}
              className="m-0"
            >
              <Input
                placeholder="18:00"
                className="rounded-lg border-none shadow-none bg-transparent"
              />
            </Form.Item>
          </div>

          {/* SECCIÓN 3: LOGO Y NOTAS */}
          <div className="space-y-4">
            <Form.Item
              name="descripcion"
              label={
                <span className="text-sm font-medium">Descripción y Notas</span>
              }
              className="m-0"
            >
              <Input.TextArea
                rows={2}
                placeholder="Información adicional sobre la sucursal..."
                className="rounded-lg px-4 py-3"
              />
            </Form.Item>

            <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50">
              <div className="flex items-center gap-3 text-gray-600 text-[13px]">
                <ImagePlus size={18} />
                <span>Identidad de sede (Logo)</span>
              </div>
              <Form.Item name="logo" className="m-0">
                <Upload
                  accept="image/*"
                  maxCount={1}
                  beforeUpload={handleUpload}
                  onRemove={handleRemoveLogo}
                  showUploadList={true}
                >
                  <Button size="middle" className="rounded-md font-medium">
                    Seleccionar
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          {/* ESTADO FINAL */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100">
            <div className="flex items-center gap-3">
              <Info size={16} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-gray-700">
                  Estado de Operación
                </span>
                <span className="text-[11px] text-gray-500">
                  ¿Esta sucursal está abierta al público?
                </span>
              </div>
            </div>
            <Form.Item name="activa" valuePropName="checked" className="m-0">
              <Switch
                checkedChildren="Activa"
                unCheckedChildren="Inactiva"
                className={
                  form.getFieldValue("activa") === false
                    ? "bg-gray-400"
                    : "bg-blue-500"
                }
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
