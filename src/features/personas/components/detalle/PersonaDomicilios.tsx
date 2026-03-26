// src/features/personas/components/detalle/PersonaDomicilios.tsx
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
} from "antd";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { TableColumnsType } from "antd";
import { ConfirmModal } from "@/shared/components/molecules/ConfirmModal";
import { Can } from "@/shared/components/atoms/Can";
import { useDomicilios } from "../../hooks/useDomicilios";
import type {
  Domicilio,
  CreateDomicilioDto,
  UpdateDomicilioDto,
  TipoDomicilio,
} from "../../types/persona-detalle.types";

const TIPO_OPTIONS: { value: TipoDomicilio; label: string }[] = [
  { value: "FISCAL", label: "Fiscal" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "ENTREGA", label: "Entrega" },
  { value: "OTRO", label: "Otro" },
];

interface PersonaDomiciliosProps {
  personaId: number;
}

export const PersonaDomicilios = ({ personaId }: PersonaDomiciliosProps) => {
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
  } = useDomicilios(personaId);

  const [form] = Form.useForm();

  const openEdit = (item: Domicilio) => {
    modal.openEdit(item);
    form.setFieldsValue(item);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values as CreateDomicilioDto | UpdateDomicilioDto);
    } catch {
      /* validación antd */
    }
  };

  const columns: TableColumnsType<Domicilio> = [
    {
      title: "Tipo",
      key: "tipo",
      width: 110,
      render: (_, r) => <Tag>{r.tipo_texto}</Tag>,
    },
    { title: "País", dataIndex: "pais", width: 100 },
    { title: "Ciudad", dataIndex: "ciudad", width: 120 },
    { title: "Dirección", dataIndex: "direccion" },
    { title: "C.P.", dataIndex: "codigo_postal", width: 80 },
    {
      title: "Principal",
      key: "principal",
      width: 170,
      render: (_, r) =>
        r.principal ? (
          <Tag color="green">Principal</Tag>
        ) : (
          <Can permission="personas.editar">
            <Tooltip title="Marcar como principal">
              <Button
                size="small"
                type="text"
                icon={<Star size={14} />}
                loading={markingPrincipalId === r.id}
                onClick={() => handleMarkPrincipal(r)}
              ></Button>
            </Tooltip>
          </Can>
        ),
    },
    {
      title: "Acciones",
      key: "acciones",
      fixed: "right",
      width: 90,
      render: (_, record) => (
        <div className="flex gap-1">
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
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Domicilios
        </h3>
        <Can permission="personas.crear">
          <Button
            type="primary"
            size="small"
            icon={<Plus size={14} />}
            onClick={() => {
              modal.openCreate();
              form.resetFields();
            }}
          >
            Agregar Domicilio
          </Button>
        </Can>
      </div>

      <Table
        dataSource={domicilios}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        scroll={{ x: 600 }}
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />

      <Modal
        open={modal.isOpen}
        title={modal.isEditMode ? "Editar Domicilio" : "Nuevo Domicilio"}
        onOk={onSubmit}
        onCancel={modal.close}
        okText={modal.isEditMode ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
        okButtonProps={{ loading: modal.isSubmitting }}
        width={520}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="tipo"
              label="Tipo"
              rules={[{ required: true, message: "Selecciona el tipo" }]}
            >
              <Select options={TIPO_OPTIONS} />
            </Form.Item>
            <Form.Item
              name="pais"
              label="País"
              rules={[{ required: true, message: "Ingresa el país" }]}
            >
              <Input placeholder="Bolivia" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="ciudad"
              label="Ciudad"
              rules={[{ required: true, message: "Ingresa la ciudad" }]}
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
            rules={[{ required: true, message: "Ingresa la dirección" }]}
          >
            <Input placeholder="Av. Principal #123" />
          </Form.Item>
          <Form.Item
            name="principal"
            label="¿Es principal?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar este domicilio?"
        description="El domicilio será eliminado. Puedes restaurarlo más adelante."
        confirmText="Eliminar"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
