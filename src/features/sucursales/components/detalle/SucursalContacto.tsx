import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  Select,
  Tag,
  Tooltip,
  Descriptions,
} from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { useSucursalContactos } from "../../hooks/useSucursalContactos";
import type {
  SucursalContacto as SucursalContactoItem,
  TipoContactoSucursal,
} from "../../types/sucursal.types";

interface SucursalContactoProps {
  sucursalId: number;
}

// ── Helpers de color por tipo ────────────────────────────────────────────────
const tipoColor: Record<TipoContactoSucursal, string> = {
  EMAIL: "blue",
  TELEFONO: "green",
  OTRO: "default",
};

// ── Formulario interno ───────────────────────────────────────────────────────
interface ContactoFormValues {
  tipo: TipoContactoSucursal;
  valor: string;
}

interface FormModalProps {
  open: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  initialValues?: Partial<ContactoFormValues>;
  onSubmit: (values: ContactoFormValues) => void;
  onCancel: () => void;
}

const ContactoFormModal = ({
  open,
  isEditMode,
  isSubmitting,
  initialValues,
  onSubmit,
  onCancel,
}: FormModalProps) => {
  const [form] = Form.useForm<ContactoFormValues>();

  return (
    <Modal
      open={open}
      title={
        <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
          {isEditMode ? "Editar contacto" : "Nuevo contacto"}
        </span>
      }
      onOk={async () => {
        try {
          const values = await form.validateFields();
          onSubmit(values);
        } catch {
          /* validación antd */
        }
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      afterOpenChange={(v) => {
        if (v && initialValues) form.setFieldsValue(initialValues);
        if (!v) form.resetFields();
      }}
      okText={isEditMode ? "Guardar cambios" : "Crear contacto"}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      width={440}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[{ required: true, message: "Selecciona un tipo" }]}
        >
          <Select
            placeholder="Seleccionar tipo"
            options={[
              { value: "EMAIL", label: "Email" },
              { value: "TELEFONO", label: "Teléfono" },
              { value: "OTRO", label: "Otro" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="valor"
          label="Valor"
          rules={[{ required: true, message: "El valor es requerido" }]}
        >
          <Input placeholder="correo@empresa.com / +591 7000 0000" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── Vista detalle (modal pequeño) ────────────────────────────────────────────
interface ViewModalProps {
  open: boolean;
  item: SucursalContactoItem | null;
  onClose: () => void;
}

const ContactoViewModal = ({ open, item, onClose }: ViewModalProps) => (
  <Modal
    open={open}
    title={
      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
        Detalle de contacto
      </span>
    }
    onCancel={onClose}
    footer={<Button onClick={onClose}>Cerrar</Button>}
    width={400}
  >
    {item && (
      <Descriptions column={1} size="small" bordered style={{ marginTop: 12 }}>
        <Descriptions.Item label="Tipo">
          <Tag color={tipoColor[item.tipo]}>{item.tipo_texto}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Valor">{item.valor}</Descriptions.Item>
        <Descriptions.Item label="Creado">{item.created_at}</Descriptions.Item>
        <Descriptions.Item label="Actualizado">
          {item.updated_at}
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

// ── Componente principal ─────────────────────────────────────────────────────
export const SucursalContacto = ({ sucursalId }: SucursalContactoProps) => {
  const { contactos, loading, modal, handleSubmit, handleDelete } =
    useSucursalContactos(sucursalId);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<SucursalContactoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SucursalContactoItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    modal.openCreate();
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (item: SucursalContactoItem) => {
    modal.openEdit(item);
    setSelected(item);
    setFormOpen(true);
  };

  const openView = (item: SucursalContactoItem) => {
    setSelected(item);
    setViewOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
    setDeleting(false);
  };

  const columns: TableColumnsType<SucursalContactoItem> = [
    {
      title: "Tipo",
      dataIndex: "tipo_texto",
      key: "tipo",
      width: 120,
      render: (_, r) => <Tag color={tipoColor[r.tipo]}>{r.tipo_texto}</Tag>,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Creado",
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
      render: (text) => (
        <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
          {text}
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
              onClick={() => openView(record)}
            />
          </Tooltip>
          <Can permission="sucursales.editar">
            <Tooltip title="Editar">
              <Button
                type="text"
                size="small"
                icon={<Pencil size={14} />}
                onClick={() => openEdit(record)}
              />
            </Tooltip>
          </Can>
          <Can permission="sucursales.eliminar">
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3
          className="font-semibold text-base"
          style={{ color: "var(--color-text-primary)", margin: 0 }}
        >
          Contactos de Sucursal
        </h3>
        <Can permission="sucursales.crear">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            size="small"
            onClick={openCreate}
          >
            Nuevo Contacto
          </Button>
        </Can>
      </div>

      {/* Tabla */}
      <Table
        rowKey="id"
        dataSource={contactos}
        columns={columns}
        loading={loading}
        pagination={false}
        size="small"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />

      {/* Modal Crear / Editar */}
      <ContactoFormModal
        open={formOpen}
        isEditMode={modal.isEditMode}
        isSubmitting={modal.isSubmitting}
        initialValues={
          modal.isEditMode && selected
            ? { tipo: selected.tipo, valor: selected.valor }
            : undefined
        }
        onSubmit={async (values) => {
          await handleSubmit(values);
          setFormOpen(false);
        }}
        onCancel={() => {
          modal.close();
          setFormOpen(false);
        }}
      />

      {/* Modal Ver */}
      <ContactoViewModal
        open={viewOpen}
        item={selected}
        onClose={() => setViewOpen(false)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar este contacto?"
        description="Esta acción eliminará el contacto permanentemente de la sucursal."
        confirmText="Eliminar"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
