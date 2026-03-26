// src/features/personas/components/detalle/PersonaContactos.tsx
import { useState } from "react";
import { Button, Modal, Form, Input, Select, Tag, Tooltip, Table } from "antd";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import type { TableColumnsType } from "antd";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { useContactos } from "../../hooks/useContactos";
import type {
  Contacto,
  UpdateContactoDto,
  TipoContacto,
} from "../../types/persona-detalle.types";

const TIPO_OPTIONS: { value: TipoContacto; label: string }[] = [
  { value: "EMAIL", label: "Email" },
  { value: "TELEFONO", label: "Teléfono" },
  { value: "OTRO", label: "Otro" },
];

const TIPO_COLOR: Record<TipoContacto, string> = {
  EMAIL: "blue",
  TELEFONO: "green",
  OTRO: "default",
};

interface PersonaContactosProps {
  personaId: number;
}

export const PersonaContactos = ({ personaId }: PersonaContactosProps) => {
  const { contactos, loading, modal, handleSubmit, handleDelete } =
    useContactos(personaId);

  const [form] = Form.useForm<UpdateContactoDto>();
  const [viewItem, setViewItem] = useState<Contacto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contacto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const tipoSeleccionado = Form.useWatch("tipo", form);

  const inputPlaceholderByTipo: Record<TipoContacto, string> = {
    EMAIL: "ej: contacto@email.com",
    TELEFONO: "ej: +591 70000000",
    OTRO: "",
  };

  /* Abre el form modal con datos si es edición */
  const openEdit = (item: Contacto) => {
    modal.openEdit(item);
    form.setFieldsValue({ tipo: item.tipo, valor: item.valor });
  };

  const openCreate = () => {
    modal.openCreate();
    form.resetFields();
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values);
    } catch {
      /* validación antd */
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
    setDeleting(false);
  };

  const columns: TableColumnsType<Contacto> = [
    {
      title: "Tipo",
      key: "tipo",
      width: 110,
      render: (_, r) => <Tag color={TIPO_COLOR[r.tipo]}>{r.tipo_texto}</Tag>,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Fecha creación",
      key: "fecha",
      width: 130,
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
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 110,
      render: (_, record) => (
        <div className="flex gap-1">
          <Tooltip title="Ver detalle">
            <Button
              type="text"
              size="small"
              icon={<Eye size={14} />}
              onClick={() => setViewItem(record)}
            />
          </Tooltip>
          <Can permission="personas.editar">
            <Tooltip title="Editar">
              <Button
                type="text"
                size="small"
                icon={<Pencil size={14} />}
                onClick={() => openEdit(record)}
              />
            </Tooltip>
          </Can>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Listado de Contactos
        </h3>
        <Can permission="personas.crear">
          <Button
            type="primary"
            size="small"
            icon={<Plus size={14} />}
            onClick={openCreate}
          >
            Nuevo Contacto
          </Button>
        </Can>
      </div>

      <Table
        dataSource={contactos}
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

      {/* Modal Crear/Editar */}
      <Modal
        open={modal.isOpen}
        title={modal.isEditMode ? "Editar Contacto" : "Nuevo Contacto"}
        onOk={onSubmit}
        onCancel={modal.close}
        okText={modal.isEditMode ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
        okButtonProps={{ loading: modal.isSubmitting }}
        width={420}
        destroyOnClose
      >
        {/* Vista previa del contacto actual si es edición */}
        {modal.isEditMode && modal.selectedItem && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-subtle)" }}
          >
            <p
              className="text-xs font-semibold m-0 mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              CONTACTO ACTUAL
            </p>
            <p
              className="text-sm m-0"
              style={{ color: "var(--color-text-primary)" }}
            >
              {modal.selectedItem.tipo_texto}: {modal.selectedItem.valor}
            </p>
          </div>
        )}

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[{ required: true, message: "Selecciona el tipo" }]}
          >
            <Select options={TIPO_OPTIONS} placeholder="Seleccionar tipo" />
          </Form.Item>
          <Form.Item
            name="valor"
            label="Valor"
            rules={[
              { required: true, message: "Ingresa el valor" },
              {
                validator: async (_, value: string) => {
                  if (!value || !tipoSeleccionado) return;

                  if (tipoSeleccionado === "EMAIL") {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value.trim())) {
                      throw new Error("Ingresa un email válido");
                    }
                  }

                  if (tipoSeleccionado === "TELEFONO") {
                    const phoneRegex = /^[+]?[-()\d\s]{6,20}$/;
                    if (!phoneRegex.test(value.trim())) {
                      throw new Error("Ingresa un teléfono válido");
                    }
                  }
                },
              },
            ]}
          >
            <Input
              placeholder={
                tipoSeleccionado
                  ? inputPlaceholderByTipo[tipoSeleccionado]
                  : "Ingresa un valor"
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Ver detalle */}
      <Modal
        open={!!viewItem}
        title="Detalle del Contacto"
        onCancel={() => setViewItem(null)}
        footer={<Button onClick={() => setViewItem(null)}>Volver</Button>}
        width={380}
      >
        {viewItem && (
          <div className="grid grid-cols-2 gap-3 py-2">
            {[
              { label: "TIPO", value: viewItem.tipo_texto },
              { label: "VALOR", value: viewItem.valor },
              {
                label: "FECHA CREADO",
                value: viewItem.created_at.slice(0, 10),
              },
              {
                label: "ÚLTIMA MODIFICACIÓN",
                value: viewItem.updated_at.slice(0, 10),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  className="text-xs font-semibold m-0"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {label}
                </p>
                <p
                  className="text-sm font-medium m-0 mt-0.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar este contacto?"
        description="Esta acción eliminará el contacto permanentemente de la persona."
        confirmText="Eliminar"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
