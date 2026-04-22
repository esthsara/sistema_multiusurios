import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Spin,
  Steps,
  Tag,
  Collapse,
} from "antd";
import type { CollapseProps } from "antd";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";

interface RoleFormValues {
  name: string;
  permissionIds: number[];
  assignNow: boolean;
}

interface RoleSubmitValues {
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
  onSubmit: (values: RoleSubmitValues) => Promise<void> | void;
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
  const [currentStep, setCurrentStep] = useState(0);
  const selectedPermissionIds = Form.useWatch("permissionIds", form) ?? [];
  const assignNow = Form.useWatch("assignNow", form);

  const sanitizePermissionIds = (value: unknown): number[] => {
    if (!Array.isArray(value)) return [];

    return Array.from(
      new Set(
        value
          .map((item) => Number(item))
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    );
  };

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      return;
    }
    form.setFieldsValue({
      name: initialName ?? "",
      permissionIds: initialPermissionIds ?? [],
      assignNow: true,
    });
  }, [open, initialName, initialPermissionIds, form]);

  const permissionsByModule = useMemo(() => {
    const groupMap = new Map<string, PermisoItem[]>();

    permissions.forEach((permission) => {
      const moduleName = permission.modulo?.trim() || "General";
      const current = groupMap.get(moduleName) ?? [];
      current.push(permission);
      groupMap.set(moduleName, current);
    });

    return Array.from(groupMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([module, items]) => ({
        module,
        items: [...items].sort((a, b) => {
          const actionA = a.accion || "";
          const actionB = b.accion || "";
          const byAction = actionA.localeCompare(actionB);
          if (byAction !== 0) return byAction;
          return String(a.name).localeCompare(String(b.name));
        }),
      }));
  }, [permissions]);

  const setPermissionIds = (value: number[]) => {
    form.setFieldsValue({ permissionIds: sanitizePermissionIds(value) });
    form.setFields([
      {
        name: "permissionIds",
        errors: [],
      },
    ]);
  };

  const togglePermission = (permissionId: number) => {
    const current = selectedPermissionIds;
    if (current.includes(permissionId)) {
      setPermissionIds(current.filter((id) => id !== permissionId));
      return;
    }
    setPermissionIds([...current, permissionId]);
  };

  const toggleModule = (modulePermissionIds: number[], checked: boolean) => {
    if (checked) {
      setPermissionIds(
        Array.from(new Set([...selectedPermissionIds, ...modulePermissionIds])),
      );
      return;
    }

    setPermissionIds(
      selectedPermissionIds.filter((id) => !modulePermissionIds.includes(id)),
    );
  };

  const handleCreateFlow = async () => {
    // STEP 1 → validar nombre
    if (currentStep === 0) {
      try {
        await form.validateFields(["name"]);
        setCurrentStep(1);
      } catch {}
      return;
    }

    // STEP 2 → decisión clave
    if (currentStep === 1) {
      const values = await form.validateFields(["assignNow", "name"]);

      // 🔥 CASO 1: NO asignar permisos → CREAR DIRECTO
      if (!values.assignNow) {
        await onSubmit({
          name: values.name,
          permissionIds: [],
        });
        return;
      }

      // 🔥 CASO 2: SI asigna permisos → ir al paso 3
      setCurrentStep(2);
      return;
    }

    // STEP 3 → crear con permisos
    try {
      const values = await form.validateFields(["name", "permissionIds"]);
      const normalizedPermissionIds = sanitizePermissionIds(
        values.permissionIds,
      );

      if (normalizedPermissionIds.length === 0) {
        form.setFields([
          {
            name: "permissionIds",
            errors: ["Selecciona al menos un permiso"],
          },
        ]);
        return;
      }

      await onSubmit({
        name: values.name,
        permissionIds: normalizedPermissionIds,
      });
    } catch {}
  };

  const handleOk = async () => {
    if (mode === "create") {
      await handleCreateFlow();
      return;
    }

    try {
      const values = await form.validateFields();
      const normalizedPermissionIds = sanitizePermissionIds(
        values.permissionIds,
      );
      const fallbackPermissionIds = sanitizePermissionIds(initialPermissionIds);

      await onSubmit({
        name: values.name,
        permissionIds:
          normalizedPermissionIds.length > 0
            ? normalizedPermissionIds
            : fallbackPermissionIds,
      });
    } catch {
      // validación de formulario
    }
  };

  const createStepTitle =
    currentStep < 2 ? "Crear rol" : "Crear rol · Permisos";

  const collapseItems: CollapseProps["items"] = permissionsByModule.map(
    (group) => {
      const ids = group.items.map((item) => item.id);

      const selectedInModule = ids.filter((id) =>
        selectedPermissionIds.includes(id),
      );

      const allSelected = selectedInModule.length === ids.length;
      const partial =
        selectedInModule.length > 0 && selectedInModule.length < ids.length;

      return {
        key: group.module,
        label: (
          <div className="flex justify-between items-center w-full pr-4">
            <span className="font-medium">{group.module}</span>

            <span className="text-sm text-gray-500">
              {selectedInModule.length}/{ids.length}
            </span>
          </div>
        ),
        children: (
          <>
            <div className="flex justify-between items-center mb-3">
              <Checkbox
                checked={allSelected}
                indeterminate={partial}
                onChange={(e) => toggleModule(ids, e.target.checked)}
              >
                Seleccionar todos
              </Checkbox>

              <span className="text-xs text-gray-400">
                {ids.length} permisos
              </span>
            </div>

            <div className="grid gap-2">
              {group.items.map((permission) => {
                const checked = selectedPermissionIds.includes(permission.id);

                return (
                  <div
                    key={permission.id}
                    className="flex justify-between items-center border rounded-md px-3 py-2 hover:bg-gray-50 transition"
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => togglePermission(permission.id)}
                    >
                      <span className="font-medium">
                        {permission.accion || permission.name}
                      </span>
                    </Checkbox>

                    <Tag
                      color={
                        permission.accion === "CREAR"
                          ? "blue"
                          : permission.accion === "ELIMINAR"
                            ? "red"
                            : permission.accion === "EDITAR"
                              ? "gold"
                              : "default"
                      }
                    >
                      {permission.accion}
                    </Tag>
                  </div>
                );
              })}
            </div>
          </>
        ),
      };
    },
  );

  const footer = (
    <div className="flex items-center justify-between">
      <div>
        {mode === "create" && currentStep > 0 ? (
          <Button onClick={() => setCurrentStep((prev) => prev - 1)}>
            Anterior
          </Button>
        ) : null}
      </div>

      <Space>
        <Button onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="primary" loading={submitting} onClick={handleOk}>
          {mode === "create"
            ? currentStep === 1 && assignNow === false
              ? "Crear rol"
              : currentStep < 2
                ? "Siguiente"
                : "Crear rol"
            : "Guardar cambios"}
        </Button>
      </Space>
    </div>
  );

  return (
    <Modal
      open={open}
      title={mode === "create" ? createStepTitle : "Editar rol"}
      onCancel={onCancel}
      footer={footer}
      width={760}
      centered
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {mode === "create" ? (
          <Steps
            current={currentStep}
            className="mb-4 mt-1"
            items={[
              { title: "Información" },
              { title: "Asignación" },
              { title: "Permisos" },
            ]}
          />
        ) : null}

        <Form
          form={form}
          layout="vertical"
          size="large"
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

          {mode === "create" && currentStep === 1 ? (
            <Form.Item name="assignNow" label="Asignación inicial de permisos">
              <Radio.Group className="w-full">
                <div className="grid gap-2">
                  <Radio value>
                    <span className="font-medium">Asignar permisos ahora</span>
                  </Radio>
                  <Radio value={false}>
                    <span className="font-medium">
                      Crear rol sin permisos iniciales
                    </span>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          ) : null}

          {mode === "edit" || (mode === "create" && currentStep === 2) ? (
            <>
              <Form.Item name="permissionIds">
                <>
                  {/* 🔥 RESUMEN GLOBAL */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="m-0 font-medium">Permisos por módulo</p>

                    <Tag color="blue">
                      {selectedPermissionIds.length} de {permissions.length}{" "}
                      seleccionados
                    </Tag>
                  </div>

                  {/* 🔥 ALERTA PRO */}
                  <Alert
                    type="warning"
                    showIcon
                    className="mb-4"
                    message="Asignación de permisos"
                    description={`Estos permisos afectarán el acceso del rol en ${permissionsByModule.length} módulos del sistema.`}
                  />

                  {/* 🔥 ACORDEÓN */}
                  <Collapse
                    accordion={false}
                    className="bg-white rounded-lg"
                    items={collapseItems}
                  />
                </>
              </Form.Item>
            </>
          ) : null}
        </Form>
      </Spin>
    </Modal>
  );
};
