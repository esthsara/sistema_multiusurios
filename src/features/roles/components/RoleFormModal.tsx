import { useEffect, useMemo } from "react";
import { Checkbox, Form, Input, Modal, Spin } from "antd";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";

interface RoleFormValues {
  name: string;
  permissionIds: number[];
}

interface RoleFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading: boolean;
  submitting: boolean;
  permissions: PermisoItem[];
  initialName?: string;
  initialPermissionIds?: number[];
  onCancel: () => void;
  onSubmit: (values: RoleFormValues) => Promise<void> | void;
}

export const RoleFormModal = ({
  open,
  mode,
  loading,
  submitting,
  permissions,
  initialName,
  initialPermissionIds,
  onCancel,
  onSubmit,
}: RoleFormModalProps) => {
  const [form] = Form.useForm<RoleFormValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      name: initialName ?? "",
      permissionIds: initialPermissionIds ?? [],
    });
  }, [open, initialName, initialPermissionIds, form]);

  const permissionOptions = useMemo(() => {
    return [...permissions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((permission) => ({
        label: `${permission.modulo || "general"} · ${permission.name}`,
        value: permission.id,
      }));
  }, [permissions]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch {
      // validación de formulario
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Crear rol" : "Editar rol"}
      okText={mode === "create" ? "Crear" : "Guardar cambios"}
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={handleOk}
      okButtonProps={{ loading: submitting }}
      cancelButtonProps={{ disabled: submitting }}
      width={760}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Nombre del rol"
            rules={[
              { required: true, message: "Ingresa el nombre del rol" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
            ]}
          >
            <Input placeholder="Ej: Administrador de Sucursal" maxLength={80} />
          </Form.Item>

          <Form.Item
            name="permissionIds"
            label="Permisos"
            rules={[
              {
                validator: (_, value: number[] | undefined) => {
                  if (Array.isArray(value) && value.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Selecciona al menos un permiso"),
                  );
                },
              },
            ]}
          >
            <div
              style={{
                maxHeight: 360,
                overflowY: "auto",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                padding: 12,
                background: "var(--color-bg-elevated)",
              }}
            >
              <Checkbox.Group options={permissionOptions} />
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
