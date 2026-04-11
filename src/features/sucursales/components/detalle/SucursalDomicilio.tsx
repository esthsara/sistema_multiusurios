import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  Descriptions,
} from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, Star } from "lucide-react";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { useSucursalDomicilios } from "../../hooks/useSucursalDomicilios";
import type {
  SucursalDomicilio as SucursalDomicilioItem,
  CreateSucursalDomicilioDto,
  TipoDomicilioSucursal,
  UpdateSucursalDomicilioDto,
} from "../../types/sucursal.types";

interface SucursalDomicilioProps {
  sucursalId: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const tipoColor: Record<TipoDomicilioSucursal, string> = {
  FISCAL: "gold",
  PARTICULAR: "blue",
  ENTREGA: "green",
  OTRO: "default",
};

// ── Form values ──────────────────────────────────────────────────────────────
interface DomicilioFormValues {
  tipo: TipoDomicilioSucursal;
  direccion: string;
  ciudad: string;
  pais: string;
  codigo_postal?: string;
  principal: boolean;
}

// ── Modal Crear / Editar ─────────────────────────────────────────────────────
interface FormModalProps {
  open: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  initialValues?: Partial<DomicilioFormValues>;
  onSubmit: (values: DomicilioFormValues) => void;
  onCancel: () => void;
}

const DomicilioFormModal = ({
  open,
  isEditMode,
  isSubmitting,
  initialValues,
  onSubmit,
  onCancel,
}: FormModalProps) => {
  const [form] = Form.useForm<DomicilioFormValues>();

  return (
    <Modal
      open={open}
      title={
        <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
          {isEditMode ? "Editar domicilio" : "Nuevo domicilio"}
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
        if (v) form.setFieldsValue({ principal: false, ...initialValues });
        else form.resetFields();
      }}
      okText={isEditMode ? "Guardar cambios" : "Crear domicilio"}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16px",
          }}
        >
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[{ required: true, message: "Selecciona un tipo" }]}
          >
            <Select
              placeholder="Tipo de domicilio"
              options={[
                { value: "FISCAL", label: "Fiscal" },
                { value: "PARTICULAR", label: "Particular" },
                { value: "ENTREGA", label: "Entrega" },
                { value: "OTRO", label: "Otro" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="pais"
            label="País"
            rules={[{ required: true, message: "El país es requerido" }]}
          >
            <Input placeholder="Bolivia" />
          </Form.Item>

          <Form.Item
            name="ciudad"
            label="Ciudad"
            rules={[{ required: true, message: "La ciudad es requerida" }]}
          >
            <Input placeholder="Santa Cruz" />
          </Form.Item>

          <Form.Item name="codigo_postal" label="Código Postal">
            <Input placeholder="12345" />
          </Form.Item>
        </div>

        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[{ required: true, message: "La dirección es requerida" }]}
        >
          <Input placeholder="Av. Principal #123, Zona Central" />
        </Form.Item>

        <Form.Item
          name="principal"
          label="Domicilio principal"
          valuePropName="checked"
        >
          <Switch checkedChildren="Sí" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ── Modal Ver ────────────────────────────────────────────────────────────────
interface ViewModalProps {
  open: boolean;
  item: SucursalDomicilioItem | null;
  onClose: () => void;
}

const DomicilioViewModal = ({ open, item, onClose }: ViewModalProps) => (
  <Modal
    open={open}
    title={
      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
        Detalle de domicilio
      </span>
    }
    onCancel={onClose}
    footer={<Button onClick={onClose}>Cerrar</Button>}
    width={440}
  >
    {item && (
      <Descriptions column={1} size="small" bordered style={{ marginTop: 12 }}>
        <Descriptions.Item label="Tipo">
          <Tag color={tipoColor[item.tipo]}>{item.tipo_texto}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="País">{item.pais}</Descriptions.Item>
        <Descriptions.Item label="Ciudad">{item.ciudad}</Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {item.direccion}
        </Descriptions.Item>
        <Descriptions.Item label="Código Postal">
          {item.codigo_postal || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Principal">
          {item.principal ? <Tag color="success">Sí</Tag> : <Tag>No</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Creado">{item.created_at}</Descriptions.Item>
        <Descriptions.Item label="Actualizado">
          {item.updated_at}
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

// ── Componente principal ─────────────────────────────────────────────────────
export const SucursalDomicilio = ({ sucursalId }: SucursalDomicilioProps) => {
  const {
    domicilios,
    loading,
    modal,
    deleteTarget,
    deleting,
    markingPrincipalId,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleMarkPrincipal,
    setDeleteTarget,
  } = useSucursalDomicilios(sucursalId);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<SucursalDomicilioItem | null>(null);

  const openCreate = () => {
    modal.openCreate();
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (item: SucursalDomicilioItem) => {
    modal.openEdit(item);
    setSelected(item);
    setFormOpen(true);
  };

  const openView = (item: SucursalDomicilioItem) => {
    setSelected(item);
    setViewOpen(true);
  };

  const columns: TableColumnsType<SucursalDomicilioItem> = [
    {
      title: "Tipo",
      dataIndex: "tipo_texto",
      key: "tipo",
      width: 110,
      render: (_, r) => <Tag color={tipoColor[r.tipo]}>{r.tipo_texto}</Tag>,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciudad",
      width: 130,
    },
    {
      title: "País",
      dataIndex: "pais",
      key: "pais",
      width: 110,
    },
    {
      title: "C.P.",
      dataIndex: "codigo_postal",
      key: "codigo_postal",
      width: 90,
      render: (text) => (
        <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Principal",
      key: "principal",
      width: 170,
      render: (_, r) =>
        r.principal ? (
          <Tag color="green">Principal</Tag>
        ) : (
          <Can permission="sucursales.editar">
            <Tooltip title="Marcar como principal">
              <Button
                size="small"
                type="text"
                icon={<Star size={14} />}
                loading={markingPrincipalId === r.id}
                onClick={() => handleMarkPrincipal(r)}
              />
            </Tooltip>
          </Can>
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
                onClick={() => handleDelete(record)}
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
          Domicilios de Sucursal
        </h3>
        <Can permission="sucursales.crear">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            size="small"
            onClick={openCreate}
          >
            Agregar Domicilio
          </Button>
        </Can>
      </div>

      {/* Tabla */}
      <Table
        rowKey="id"
        dataSource={domicilios}
        columns={columns}
        loading={loading}
        pagination={false}
        size="small"
        locale={{ emptyText: "Sin domicilios registrados" }}
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />

      {/* Modal Crear / Editar */}
      <DomicilioFormModal
        open={formOpen}
        isEditMode={modal.isEditMode}
        isSubmitting={modal.isSubmitting}
        initialValues={
          modal.isEditMode && selected
            ? {
                tipo: selected.tipo,
                direccion: selected.direccion,
                ciudad: selected.ciudad,
                pais: selected.pais,
                codigo_postal: selected.codigo_postal ?? undefined,
                principal: selected.principal,
              }
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
      <DomicilioViewModal
        open={viewOpen}
        item={selected}
        onClose={() => setViewOpen(false)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar este domicilio?"
        description="El domicilio será eliminado de la sucursal."
        confirmText="Eliminar"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
