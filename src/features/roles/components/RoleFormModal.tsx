// src/features/roles/components/RoleFormModal.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Steps,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { CollapseProps } from "antd";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MinusSquare,
  PlusCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppTag } from "@/shared/components/atoms/AppTag";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";
import {
  agruparCatalogoPermisosPorModulo,
  contarSeleccionadosEnModulo,
  getModuloStyles,
  sanitizePermissionIds,
} from "../utils/roles.utils";

const { Text, Title } = Typography;

interface RoleFormValues {
  name: string;
  permissionIds: number[];
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

/** Mapea accion → tone para los tags de permisos */
const accionToTone = (
  accion: string,
): "success" | "warning" | "danger" | "primary" | "neutral" => {
  const a = accion.toLowerCase();
  if (a.includes("ver") || a.includes("exportar")) return "success";
  if (a.includes("crear") || a.includes("subir") || a.includes("asignar"))
    return "primary";
  if (a.includes("editar")) return "warning";
  if (a.includes("eliminar")) return "danger";
  return "neutral";
};

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
  const { token } = theme.useToken();
  const [form] = Form.useForm<RoleFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const selectedPermissionIds = Form.useWatch("permissionIds", form) ?? [];

  /* ── Reset al abrir/cerrar ── */
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setSearchText("");
      setActiveKeys([]);
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      name: initialName ?? "",
      permissionIds: initialPermissionIds ?? [],
    });
    // En modo edición, abrir todos los acordeones
    if (mode === "edit") {
      setActiveKeys(
        agruparCatalogoPermisosPorModulo(permissions).map((g) => g.module),
      );
    }
  }, [open, initialName, initialPermissionIds, form, mode, permissions]);

  /* ── Permisos agrupados por módulo ── */
  const permissionsByModule = useMemo(
    () => agruparCatalogoPermisosPorModulo(permissions),
    [permissions],
  );

  const filteredPermissionsByModule = useMemo(() => {
    if (!searchText.trim()) return permissionsByModule;
    const lowerSearch = searchText.toLowerCase();
    return permissionsByModule
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (p) =>
            p.name?.toLowerCase().includes(lowerSearch) ||
            p.accion?.toLowerCase().includes(lowerSearch) ||
            group.module.toLowerCase().includes(lowerSearch),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [permissionsByModule, searchText]);

  /* Auto-expandir al buscar */
  useEffect(() => {
    if (searchText.trim()) {
      setActiveKeys(filteredPermissionsByModule.map((g) => g.module));
    }
  }, [searchText, filteredPermissionsByModule]);

  /* ── Helpers de selección ── */
  const setPermissionIds = (value: number[]) => {
    form.setFieldsValue({ permissionIds: sanitizePermissionIds(value) });
    form.setFields([{ name: "permissionIds", errors: [] }]);
  };

  const togglePermission = (id: number) => {
    const current: number[] = selectedPermissionIds;
    if (current.includes(id)) {
      setPermissionIds(current.filter((x) => x !== id));
    } else {
      setPermissionIds([...current, id]);
    }
  };

  const toggleModule = (ids: number[], checked: boolean) => {
    if (checked) {
      setPermissionIds([...new Set([...selectedPermissionIds, ...ids])]);
    } else {
      setPermissionIds(
        (selectedPermissionIds as number[]).filter((id) => !ids.includes(id)),
      );
    }
  };

  const selectAll = () => setPermissionIds(permissions.map((p) => p.id));
  const clearAll = () => setPermissionIds([]);

  /* ── Handlers de submit ── */
  const handleCreateWithoutPermissions = async () => {
    const values = await form.validateFields(["name"]);
    await onSubmit({ name: values.name, permissionIds: [] });
  };

  const handleCreateFlow = async () => {
    if (currentStep === 0) {
      await form.validateFields(["name"]);
      setCurrentStep(1);
      return;
    }
    // step 1 = opciones (sin permisos o configurar)
    // step 2 = selección de permisos
    if (currentStep === 2) {
      const values = await form.validateFields(["name", "permissionIds"]);
      const ids = sanitizePermissionIds(values.permissionIds);
      if (ids.length === 0) {
        form.setFields([
          {
            name: "permissionIds",
            errors: ["Selecciona al menos un permiso"],
          },
        ]);
        return;
      }
      await onSubmit({ name: values.name, permissionIds: ids });
    }
  };

  const handleEditSubmit = async () => {
    const values = await form.validateFields();
    const ids = sanitizePermissionIds(values.permissionIds);
    await onSubmit({
      name: values.name,
      permissionIds:
        ids.length > 0 ? ids : sanitizePermissionIds(initialPermissionIds),
    });
  };

  const handleOk = () =>
    mode === "create" ? handleCreateFlow() : handleEditSubmit();

  /* ── Barra de herramientas de selección ── */
  const SelectionBar = () => (
    <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
      <Space>
        <ShieldAlert size={16} style={{ color: token.colorPrimary }} />
        <Text strong>Permisos seleccionados</Text>
        <Badge
          count={selectedPermissionIds.length}
          showZero
          style={{ backgroundColor: token.colorSuccess }}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          de {permissions.length} disponibles
        </Text>
      </Space>
      <Space>
        <Button
          size="small"
          icon={<CheckSquare size={13} />}
          onClick={selectAll}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          Todos
        </Button>
        <Button
          size="small"
          icon={<MinusSquare size={13} />}
          onClick={clearAll}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          Ninguno
        </Button>
      </Space>
    </Flex>
  );

  /* ── Acordeón de permisos ── */
  const collapseItems: CollapseProps["items"] = filteredPermissionsByModule.map(
    (group) => {
      const ids = group.items.map((i) => i.id);
      const { allSelected, someSelected, selected } =
        contarSeleccionadosEnModulo(ids, selectedPermissionIds);
      const moduloStyles = getModuloStyles(group.module);

      const header = (
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Space>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => toggleModule(ids, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />

            <Text strong style={{ textTransform: "capitalize" }}>
              {group.module}
            </Text>
          </Space>

          <Text type="secondary" style={{ fontSize: 12 }}>
            {selected}/{ids.length}
          </Text>
        </Flex>
      );

      const content = (
        <div style={{ paddingTop: 8 }}>
          <Flex wrap="wrap" gap={16} align="center">
            {group.items.map((p) => {
              const checked = (selectedPermissionIds as number[]).includes(
                p.id,
              );

              return (
                <Checkbox
                  key={p.id}
                  checked={checked}
                  onChange={() => togglePermission(p.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: checked
                      ? `1px solid ${token.colorPrimary}`
                      : "1px solid transparent",
                    background: checked
                      ? `color-mix(in srgb, ${token.colorPrimary} 10%, transparent)`
                      : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{p.accion}</span>
                </Checkbox>
              );
            })}
          </Flex>
        </div>
      );
      return {
        key: group.module,
        label: header,
        children: content,
        showArrow: true,
      };
    },
  );

  /* ── Opciones de creación (step 1) ── */
  const renderCreateOptions = () => (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        message={
          <span style={{ color: "var(--color-primary-600)", fontWeight: 600 }}>
            ¿Cómo quieres crear este rol?
          </span>
        }
        description={
          <span style={{ color: "var(--color-text-secondary)" }}>
            Puedes crear el rol sin permisos ahora y asignarlos después, o
            configurarlos en este momento.
          </span>
        }
        type="info"
        showIcon
        icon={<Info size={16} style={{ color: "var(--color-primary-600)" }} />}
        style={{
          borderRadius: 8,
          backgroundColor: "var(--color-alert-primary-bg)",
          borderColor: "var(--tag-primary-border)",
        }}
      />
      <Card style={{ borderRadius: "var(--radius-md)" }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {/* Opción 1: Sin permisos */}
          <Flex justify="space-between" align="center">
            <Space>
              <Clock size={20} style={{ color: token.colorTextSecondary }} />
              <div>
                <Text strong>Crear sin permisos</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  El rol se crea de inmediato. Puedes añadir permisos después.
                </Text>
              </div>
            </Space>
            <Button
              type="default"
              onClick={handleCreateWithoutPermissions}
              loading={submitting}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              Crear ahora
            </Button>
          </Flex>

          <Divider style={{ margin: "4px 0" }}>
            <AppTag tone="neutral">O</AppTag>
          </Divider>

          {/* Opción 2: Con permisos */}
          <Flex justify="space-between" align="center">
            <Space>
              <Sparkles size={20} style={{ color: token.colorPrimary }} />
              <div>
                <Text strong>Configurar permisos ahora</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Elige los permisos específicos que tendrá este rol.
                </Text>
              </div>
            </Space>
            <Button
              type="primary"
              onClick={() => setCurrentStep(2)}
              icon={<ChevronRight size={15} />}
              iconPlacement="end"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              Continuar
            </Button>
          </Flex>
        </Space>
      </Card>
    </Space>
  );

  /* ── Panel de selección de permisos ── */
  const renderPermissions = () => (
    <>
      <SelectionBar />
      <Input
        placeholder="Buscar permiso, módulo o acción..."
        prefix={<Search size={15} />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{
          marginBottom: 12,
          borderRadius: "var(--radius-md)",
        }}
      />
      <Form.Item name="permissionIds" style={{ margin: 0 }}>
        {filteredPermissionsByModule.length === 0 ? (
          <Empty
            description="No se encontraron permisos"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Collapse
            items={collapseItems}
            activeKey={activeKeys}
            onChange={(keys) => setActiveKeys(keys as string[])}
            size="small"
            bordered
            expandIconPlacement="end"
            style={{
              maxHeight: 440,
              overflowY: "auto",
              borderRadius: "var(--radius-md)",
            }}
          />
        )}
      </Form.Item>
    </>
  );

  /* ── Footer dinámico ── */
  const renderFooter = () => {
    if (mode === "create" && currentStep === 1) return null; // Sin footer en opciones

    return (
      <Flex justify="space-between" align="center">
        {/* Botón Anterior */}
        {mode === "create" && currentStep === 2 && (
          <Button
            onClick={() => setCurrentStep(1)}
            icon={<ChevronLeft size={15} />}
          >
            Anterior
          </Button>
        )}
        <Flex gap={8} style={{ marginLeft: "auto" }}>
          <Button onClick={onCancel}>Cancelar</Button>
          {mode === "edit" && (
            <Button type="primary" loading={submitting} onClick={handleOk}>
              Guardar cambios
            </Button>
          )}
          {mode === "create" && currentStep === 0 && (
            <Button
              type="primary"
              loading={submitting}
              onClick={handleOk}
              icon={<ChevronRight size={15} />}
              iconPlacement="end"
            >
              Siguiente
            </Button>
          )}
          {mode === "create" && currentStep === 2 && (
            <Button type="primary" loading={submitting} onClick={handleOk}>
              Crear rol
            </Button>
          )}
        </Flex>
      </Flex>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={renderFooter()}
      width={900}
      centered
      destroyOnHidden
      title={
        <Flex align="center" gap={12}>
          {mode === "create" ? (
            <PlusCircle size={22} style={{ color: token.colorPrimary }} />
          ) : (
            <ShieldCheck size={22} style={{ color: token.colorPrimary }} />
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {mode === "create" ? "Nuevo Rol" : "Editar Rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {mode === "create"
                ? "Configura el nombre y los permisos del nuevo rol"
                : "Modifica el nombre o los permisos del rol"}
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: 0 },
      }}
    >
      <Spin spinning={loading}>
        {/* Steps solo en creación */}
        {mode === "create" && currentStep !== 1 && (
          <div style={{ padding: "20px 24px 0" }}>
            <Steps
              current={currentStep === 2 ? 1 : currentStep}
              size="small"
              items={[
                { title: "Nombre del rol", icon: <Info size={13} /> },
                {
                  title: "Permisos",
                  icon: <ShieldAlert size={13} />,
                },
              ]}
            />
          </div>
        )}

        <div style={{ padding: 24 }}>
          <Form form={form} layout="vertical" requiredMark={false}>
            {/* Campo nombre siempre visible */}
            <Form.Item
              name="name"
              label="Nombre del rol"
              rules={[
                { required: true, message: "El nombre es requerido" },
                { min: 3, message: "Mínimo 3 caracteres" },
                { max: 50, message: "Máximo 50 caracteres" },
              ]}
            >
              <Input
                placeholder="Ej: Administrador, Editor, Visualizador"
                size="large"
                autoFocus={currentStep === 0}
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </Form.Item>

            {/* Opciones de creación */}
            {mode === "create" && currentStep === 1 && renderCreateOptions()}

            {/* Selección de permisos */}
            {mode === "edit" && permissions.length > 0 && renderPermissions()}
            {mode === "create" && currentStep === 2 && renderPermissions()}
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default RoleFormModal;
