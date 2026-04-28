import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Spin,
  Steps,
  Collapse,
  Space,
  Tag,
  Typography,
  Divider,
  Card,
  Flex,
  Alert,
  Badge,
  Empty,
} from "antd";
import type { CollapseProps } from "antd";
import {
  ShieldCheck,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  Info,
  Lock,
  ShieldAlert,
  Sparkles,
  Clock,
  Search,
  CheckSquare,
  MinusSquare,
  Square,
} from "lucide-react";
import type { PermisoItem } from "@/features/permisos/types/permiso.types";

const { Text, Title } = Typography;

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
  const [searchText, setSearchText] = useState("");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

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
      setSearchText("");
      setActiveKeys([]);
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      name: initialName ?? "",
      permissionIds: initialPermissionIds ?? [],
      assignNow: true,
    });
  }, [open, initialName, initialPermissionIds, form]);

  const permissionsByModule = useMemo(() => {
    const map = new Map<string, PermisoItem[]>();

    permissions.forEach((p) => {
      const key = p.modulo?.trim() || "General";
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    });

    return Array.from(map.entries()).map(([module, items]) => ({
      module,
      items,
    }));
  }, [permissions]);

  // Filtrar permisos por búsqueda
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
      .filter((group) => group.items.length > 0);
  }, [permissionsByModule, searchText]);

  // Auto-abrir acordeones cuando hay búsqueda
  useEffect(() => {
    if (searchText.trim()) {
      setActiveKeys(filteredPermissionsByModule.map((g) => g.module));
    }
  }, [searchText, filteredPermissionsByModule]);

  const setPermissionIds = (value: number[]) => {
    form.setFieldsValue({ permissionIds: sanitizePermissionIds(value) });
    form.setFields([{ name: "permissionIds", errors: [] }]);
  };

  const togglePermission = (id: number) => {
    const current = selectedPermissionIds;
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
      setPermissionIds(selectedPermissionIds.filter((id) => !ids.includes(id)));
    }
  };

  const selectAllPermissions = () => {
    const allIds = permissions.map((p) => p.id);
    setPermissionIds(allIds);
  };

  const clearAllPermissions = () => {
    setPermissionIds([]);
  };

  const handleCreateWithoutPermissions = async () => {
    const values = await form.validateFields(["name"]);
    await onSubmit({
      name: values.name,
      permissionIds: [],
    });
  };

  const handleCreateFlow = async () => {
    if (currentStep === 0) {
      await form.validateFields(["name"]);
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      const values = await form.validateFields(["assignNow", "name"]);

      if (!values.assignNow) {
        await handleCreateWithoutPermissions();
        return;
      }

      setCurrentStep(2);
      return;
    }

    const values = await form.validateFields(["name", "permissionIds"]);

    const ids = sanitizePermissionIds(values.permissionIds);

    if (ids.length === 0) {
      form.setFields([
        { name: "permissionIds", errors: ["Selecciona al menos un permiso"] },
      ]);
      return;
    }

    await onSubmit({
      name: values.name,
      permissionIds: ids,
    });
  };

  const handleOk = async () => {
    if (mode === "create") return handleCreateFlow();

    const values = await form.validateFields();

    const ids = sanitizePermissionIds(values.permissionIds);

    await onSubmit({
      name: values.name,
      permissionIds:
        ids.length > 0 ? ids : sanitizePermissionIds(initialPermissionIds),
    });
  };

  // Componente de selección masiva
  const MassSelectionBar = () => (
    <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
      <Space>
        <ShieldAlert size={18} />
        <Text strong>Permisos seleccionados</Text>
        <Badge
          count={selectedPermissionIds.length}
          showZero
          style={{ backgroundColor: "#52c41a" }}
        />
      </Space>
      <Space>
        <Button
          size="small"
          icon={<CheckSquare size={14} />}
          onClick={selectAllPermissions}
        >
          Seleccionar todos
        </Button>
        <Button
          size="small"
          icon={<MinusSquare size={14} />}
          onClick={clearAllPermissions}
        >
          Limpiar todo
        </Button>
      </Space>
    </Flex>
  );

  // Componente de búsqueda
  const SearchBar = () => (
    <Input
      placeholder="Buscar permiso por nombre, acción o módulo..."
      prefix={<Search size={16} />}
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      allowClear
      style={{ marginBottom: 16 }}
      size="middle"
    />
  );

  const collapseItems: CollapseProps["items"] = filteredPermissionsByModule.map(
    (group) => {
      const ids = group.items.map((i) => i.id);
      const selectedCount = ids.filter((id) =>
        selectedPermissionIds.includes(id),
      ).length;
      const isAllSelected = selectedCount === ids.length;
      const isIndeterminate = selectedCount > 0 && selectedCount < ids.length;

      // Generar el header del acordeón
      const header = (
        <Flex
          justify="space-between"
          align="center"
          style={{ width: "100%" }}
          onClick={(e) => e.stopPropagation()} // Prevenir que el checkbox cierre el acordeón
        >
          <Space>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => toggleModule(ids, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <Text strong>{group.module}</Text>
          </Space>
          <Tag color={isAllSelected ? "success" : "default"}>
            {selectedCount}/{ids.length}
          </Tag>
        </Flex>
      );

      // Contenido del acordeón
      const content = (
        <Flex wrap="wrap" gap="small" style={{ marginTop: 8 }}>
          {group.items.map((p) => {
            const checked = selectedPermissionIds.includes(p.id);

            return (
              <Card
                key={p.id}
                size="small"
                hoverable
                style={{
                  width: "calc(50% - 8px)",
                  minWidth: "200px",
                  cursor: "pointer",
                  border: checked
                    ? "2px solid var(--ant-color-primary)"
                    : "1px solid var(--ant-color-border)",
                  backgroundColor: checked
                    ? "var(--ant-color-primary-bg)"
                    : "white",
                  transition: "all 0.2s ease",
                }}
                onClick={() => togglePermission(p.id)}
              >
                <Flex align="center" gap="small">
                  <Checkbox
                    checked={checked}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      togglePermission(p.id);
                    }}
                  />
                  <Text style={{ flex: 1 }}>{p.accion || p.name}</Text>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      );

      return {
        key: group.module,
        label: header,
        children: content,
        showArrow: true,
      };
    },
  );

  const renderCreateOptions = () => (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        message="Dos formas de crear un rol"
        description="Puedes crear el rol inmediatamente sin permisos, o continuar para configurarlos ahora."
        type="info"
        showIcon
      />

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Flex justify="space-between" align="center">
            <Space>
              <Clock size={20} />
              <div>
                <Text strong>Crear sin permisos</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  El rol se creará inmediatamente sin permisos
                </Text>
              </div>
            </Space>
            <Button
              type="default"
              onClick={handleCreateWithoutPermissions}
              loading={submitting}
            >
              Crear ahora
            </Button>
          </Flex>

          <Divider style={{ margin: "8px 0" }}>
            <Tag>O</Tag>
          </Divider>

          <Flex justify="space-between" align="center">
            <Space>
              <Sparkles size={20} />
              <div>
                <Text strong>Configurar permisos</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Continúa para asignar permisos específicos
                </Text>
              </div>
            </Space>
            <Button
              type="primary"
              onClick={() => setCurrentStep(2)}
              icon={<ChevronRight size={16} />}
              iconPosition="end"
            >
              Continuar
            </Button>
          </Flex>
        </Space>
      </Card>
    </Space>
  );

  const renderPermissions = () => (
    <>
      <MassSelectionBar />
      <SearchBar />

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
          size="middle"
          bordered
          expandIconPosition="end"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        />
      )}
    </>
  );

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={
        mode === "create" && currentStep === 1 ? null : (
          <Flex justify="space-between" align="center">
            {mode === "create" && currentStep > 0 && currentStep !== 2 && (
              <Button
                onClick={() => setCurrentStep((p) => p - 1)}
                icon={<ChevronLeft size={16} />}
              >
                Anterior
              </Button>
            )}

            <Flex gap="small" style={{ marginLeft: "auto" }}>
              <Button onClick={onCancel}>Cancelar</Button>

              {mode === "edit" && (
                <Button type="primary" loading={submitting} onClick={handleOk}>
                  Guardar cambios
                </Button>
              )}

              {mode === "create" && currentStep !== 1 && (
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={handleOk}
                  icon={currentStep === 0 ? <ChevronRight size={16} /> : null}
                  iconPosition="end"
                >
                  {currentStep === 0 ? "Siguiente" : "Crear rol"}
                </Button>
              )}
            </Flex>
          </Flex>
        )
      }
      width={900}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap="middle">
          {mode === "create" ? (
            <PlusCircle
              size={24}
              style={{ color: "var(--ant-color-primary)" }}
            />
          ) : (
            <ShieldCheck size={24} />
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {mode === "create" ? "Nuevo Rol" : "Editar Rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {mode === "create"
                ? "Configura el nombre y los permisos del nuevo rol"
                : "Modifica el nombre y los permisos del rol"}
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Spin spinning={loading}>
        {/* STEPS */}
        {mode === "create" && currentStep !== 1 && (
          <div style={{ padding: "24px 24px 0 24px" }}>
            <Steps
              current={currentStep}
              size="small"
              items={[
                { title: "Nombre", icon: <Info size={14} /> },
                { title: "Permisos", icon: <ShieldAlert size={14} /> },
              ]}
            />
          </div>
        )}

        {/* FORM CONTENT */}
        <div style={{ padding: 24 }}>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="name"
              label="Nombre del rol"
              rules={[
                { required: true, message: "El nombre del rol es requerido" },
                { min: 3, message: "Mínimo 3 caracteres" },
                { max: 50, message: "Máximo 50 caracteres" },
              ]}
            >
              <Input
                placeholder="Ej: Administrador, Editor, Visualizador"
                size="large"
                autoFocus={currentStep === 0}
              />
            </Form.Item>

            {mode === "create" && currentStep === 1 && renderCreateOptions()}

            {mode === "edit" && permissions.length > 0 && renderPermissions()}

            {mode === "create" && currentStep === 2 && renderPermissions()}
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default RoleFormModal;
