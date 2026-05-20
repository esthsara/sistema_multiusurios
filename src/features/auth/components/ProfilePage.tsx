import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowLeft,
  Mail,
  Shield,
  BadgeCheck,
  Building2,
  Fingerprint,
  IdCard,
  KeyRound,
  Lock,
  LogIn,
  MapPin,
  Phone,
  RefreshCw,
  User,
  Users,
  CheckCircle2,
  XCircle,
  CreditCard,
  ClockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/shared/hooks/useAuth";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { authService } from "@/features/auth/services/auth.service";
import type { ChangePasswordDto } from "@/shared/types/auth.types";
import { safeText } from "@/shared/utils/sanitize";
import { sanitizeInput } from "@/shared/utils/sanitize";
import { tokenManager } from "@/shared/utils/tokenManager";

const { Title, Text, Paragraph } = Typography;

const formatDateTime = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "")
    return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(date);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "U";

// ─── Shared Styles ───────────────────────────────────────────────────────────
const cardBase = {
  background: "var(--color-bg-base-2)",
  borderColor: "var(--color-border)",
  boxShadow: "var(--shadow-card)",
} as const;

const infoBox = {
  background: "var(--color-bg-base-2)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  padding: "12px 16px",
} as const;

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div
    style={{
      ...infoBox,
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background:
          "var(--color-primary-50, rgba(var(--color-primary-rgb,99,102,241),0.08))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-primary-600)",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <Text
        type="secondary"
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </Text>
      <div
        style={{
          color: "var(--color-text-primary)",
          fontWeight: 700,
          fontSize: 15,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

// ─── Permission Badge ─────────────────────────────────────────────────────────
const PermBadge = ({ label }: { label: string }) => (
  <Tooltip title={label}>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        background: "var(--color-bg-base-2)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-secondary)",
        maxWidth: 220,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "default",
      }}
    >
      <CheckCircle2
        size={11}
        style={{ color: "var(--color-success-500)", flexShrink: 0 }}
      />
      {label}
    </span>
  </Tooltip>
);

// ─── Branch Card ──────────────────────────────────────────────────────────────
const BranchCard = ({
  branch,
}: {
  branch: { id: string | number; nombre: string; clave?: string };
}) => (
  <div
    style={{
      ...infoBox,
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: "var(--color-primary-50, rgba(99,102,241,0.08))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-primary-600)",
        flexShrink: 0,
      }}
    >
      <Building2 size={16} />
    </div>
    <div style={{ minWidth: 0 }}>
      <Text
        strong
        style={{
          color: "var(--color-text-primary)",
          display: "block",
          fontSize: 14,
        }}
      >
        {branch.nombre}
      </Text>
      {branch.clave && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Clave: {branch.clave}
        </Text>
      )}
    </div>
  </div>
);

// ─── Change Password Modal ────────────────────────────────────────────────────
const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ChangePasswordDto) => Promise<void>;
  loading: boolean;
}) => {
  const [form] = Form.useForm<ChangePasswordDto>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch {
      // validation errors handled by form
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      title={
        <Space>
          <Lock size={16} style={{ color: "var(--color-primary-600)" }} />
          <span style={{ color: "var(--color-text-primary)" }}>
            Cambiar contraseña
          </span>
        </Space>
      }
      okText={loading ? "Actualizando..." : "Actualizar contraseña"}
      cancelText="Cancelar"
      width={440}
      destroyOnHidden

    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 18, marginTop: 8 }}
        title="Al cambiar tu contraseña, la sesión actual se cerrará automáticamente."
      />
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          name="current_password"
          label="Contraseña actual"
          rules={[{ required: true, message: "Ingresa tu contraseña actual" }]}
        >
          <Input.Password
            size="large"
            placeholder="••••••••"
            prefix={<KeyRound size={16} />}
          />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Nueva contraseña"
          rules={[
            { required: true, message: "Ingresa la nueva contraseña" },
            { min: 8, message: "Debe tener al menos 8 caracteres" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Nueva contraseña"
            prefix={<KeyRound size={16} />}
          />
        </Form.Item>
        <Form.Item
          name="new_password_confirmation"
          label="Confirmar nueva contraseña"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Confirma la nueva contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value)
                  return Promise.resolve();
                return Promise.reject(
                  new Error("Las contraseñas no coinciden"),
                );
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Repite la nueva contraseña"
            prefix={<Shield size={16} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, sucursalActiva, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const displayName = safeText(user?.persona.nombreCompleto, "Usuario", 140);
  const email = safeText(user?.email, "Sin email", 140);
  const username = safeText(user?.username, "Sin usuario", 140);
  const primaryRole = safeText(user?.roles[0]?.name, "Sin rol", 120);
  const personType = safeText(
    user?.persona.tipoTexto ?? user?.persona.tipoPersona,
    "No disponible",
    120,
  );
  const personStatus = safeText(
    user?.persona.estadoTexto ?? user?.persona.estado,
    "No disponible",
    120,
  );
  const roleTags = useMemo(() => user?.roles ?? [], [user?.roles]);
  const permissionTags = useMemo(() => user?.permisos ?? [], [user?.permisos]);
  const branchList = useMemo(() => user?.sucursales ?? [], [user?.sucursales]);
  const loginTime = tokenManager.getLoginTime();

  const handleChangePassword = async (values: ChangePasswordDto) => {
    setIsChangingPassword(true);
    try {
      const dto: ChangePasswordDto = {
        current_password: sanitizeInput(values.current_password, {
          trim: false,
          maxLength: 256,
          stripTags: false,
        }),
        new_password: sanitizeInput(values.new_password, {
          trim: false,
          maxLength: 256,
          stripTags: false,
        }),
        new_password_confirmation: sanitizeInput(
          values.new_password_confirmation,
          { trim: false, maxLength: 256, stripTags: false },
        ),
      };
      await authService.changePassword(dto);
      setPasswordModalOpen(false);
      toast.success("Contraseña actualizada. Debes iniciar sesión nuevamente.");
      await logout();
    } catch (error) {
      const apiError = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };
      const firstError = apiError.errors
        ? Object.values(apiError.errors)[0]?.[0]
        : null;
      toast.error(
        safeText(
          firstError ?? apiError.message,
          "No se pudo cambiar la contraseña",
          200,
        ),
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Card style={cardBase}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Badge
                count={user?.activo ? 1 : 0}
                size="small"
                color={
                  user?.activo
                    ? "var(--color-success-500)"
                    : "var(--color-danger-500)"
                }
              >
                <Avatar
                  size={72}
                  style={{
                    backgroundColor: "var(--color-primary-600)",
                    color: "var(--color-text-inverse)",
                    fontSize: 26,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(displayName)}
                </Avatar>
              </Badge>

              <div>
                <Title
                  level={3}
                  style={{ margin: 0, color: "var(--color-text-primary)" }}
                >
                  {displayName}
                </Title>
                <Space wrap size={[6, 6]} style={{ marginTop: 6 }}>
                  <Tag color="blue" icon={<User size={11} />}>
                    {username}
                  </Tag>
                  <Tag
                    color={user?.activo ? "green" : "red"}
                    icon={<BadgeCheck size={11} />}
                  >
                    {user?.activo ? "Activo" : "Inactivo"}
                  </Tag>
                  <Tag color="geekblue" icon={<Shield size={11} />}>
                    {primaryRole}
                  </Tag>
                </Space>
              </div>
            </div>

            <Space wrap>
              <Button
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
              <Button
                icon={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Refrescar
              </Button>
              <Button
                icon={<Lock size={16} />}
                onClick={() => setPasswordModalOpen(true)}
              >
                Cambiar contraseña
              </Button>
              <Button danger onClick={logout}>
                Cerrar sesión
              </Button>
            </Space>
          </div>
        </Card>

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Correo" value={email} icon={<Mail size={18} />} />
          <StatCard
            label="Rol principal"
            value={primaryRole}
            icon={<Shield size={18} />}
          />
          <StatCard
            label="Permisos"
            value={permissionTags.length}
            icon={<CheckCircle2 size={18} />}
          />
          <StatCard
            label="Sucursales"
            value={branchList.length}
            icon={<Building2 size={18} />}
          />
        </div>

        {/* ── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          {/* Left: Personal Data + Session */}
          <div className="flex flex-col gap-4">
            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Datos personales
                </span>
              }
              style={cardBase}
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item
                  label={
                    <>
                      <IdCard size={13} style={{ marginRight: 6 }} />
                      Documento
                    </>
                  }
                >
                  {safeText(
                    user?.persona.identificacionPrincipal,
                    "No disponible",
                    120,
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Mail size={13} style={{ marginRight: 6 }} />
                      Correo electrónico
                    </>
                  }
                >
                  {email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <User size={13} style={{ marginRight: 6 }} />
                      Usuario
                    </>
                  }
                >
                  {username}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Building2 size={13} style={{ marginRight: 6 }} />
                      Tipo de persona
                    </>
                  }
                >
                  {personType}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <MapPin size={13} style={{ marginRight: 6 }} />
                      Estado
                    </>
                  }
                >
                  {personStatus}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Phone size={13} style={{ marginRight: 6 }} />
                      Fecha de nacimiento
                    </>
                  }
                >
                  {formatDate(user?.persona.fechaNacimiento)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Fingerprint size={13} style={{ marginRight: 6 }} />
                      Género
                    </>
                  }
                >
                  {safeText(user?.persona.genero, "No disponible", 120)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CreditCard size={13} style={{ marginRight: 6 }} />
                      Foto de perfil
                    </>
                  }
                >
                  {user?.persona.fotoPatch
                    ? safeText(user.persona.fotoPatch, "Sin foto", 120)
                    : "Sin foto"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Seguridad y sesión
                </span>
              }
              style={cardBase}
              extra={
                <Button
                  size="small"
                  icon={<Lock size={13} />}
                  onClick={() => setPasswordModalOpen(true)}
                >
                  Cambiar contraseña
                </Button>
              }
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item
                  label={
                    <>
                      <KeyRound size={13} style={{ marginRight: 6 }} />
                      Autenticación
                    </>
                  }
                >
                  <Space size={6}>
                    {isAuthenticated ? (
                      <>
                        <CheckCircle2
                          size={14}
                          style={{ color: "var(--color-success-500)" }}
                        />{" "}
                        Autenticado
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={14}
                          style={{ color: "var(--color-danger-500)" }}
                        />{" "}
                        No autenticado
                      </>
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <LogIn size={13} style={{ marginRight: 6 }} />
                      Inicio de sesión
                    </>
                  }
                >
                  <Space size={6}>
                    <ClockIcon
                      size={13}
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    {formatDateTime(loginTime)}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Shield size={13} style={{ marginRight: 6 }} />
                      ID de sesión
                    </>
                  }
                >
                  <Text code style={{ fontSize: 12 }}>
                    {user?.sessionId ?? "No disponible"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Building2 size={13} style={{ marginRight: 6 }} />
                      Sucursal activa
                    </>
                  }
                >
                  {sucursalActiva ? (
                    <>
                      <Tag color="green">{sucursalActiva.nombre}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ({sucursalActiva.clave})
                      </Text>
                    </>
                  ) : (
                    <Text type="secondary">Sin sucursal activa</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <Users size={13} style={{ marginRight: 6 }} />
                      Sucursales asignadas
                    </>
                  }
                >
                  <Tag color="blue">{branchList.length}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Right: Roles & Permissions */}
          <div className="flex flex-col gap-4">
            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Roles asignados
                </span>
              }
              style={cardBase}
            >
              {roleTags.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {roleTags.map((role) => (
                    <div
                      key={`${role.id}-${role.name}`}
                      style={{
                        ...infoBox,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background:
                            "var(--color-primary-50, rgba(99,102,241,0.08))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-primary-600)",
                          flexShrink: 0,
                        }}
                      >
                        <Shield size={15} />
                      </div>
                      <Text
                        strong
                        style={{
                          color: "var(--color-text-primary)",
                          fontSize: 14,
                        }}
                      >
                        {role.name}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Sin roles asignados"
                />
              )}
            </Card>

            <Card
              title={
                <Space>
                  <span style={{ color: "var(--color-text-primary)" }}>
                    Permisos
                  </span>
                  <Tag color="blue" style={{ fontWeight: 600 }}>
                    {permissionTags.length}
                  </Tag>
                </Space>
              }
              style={cardBase}
            >
              {permissionTags.length > 0 ? (
                <div
                  style={{
                    maxHeight: 300,
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    padding: "4px 0",
                  }}
                >
                  {permissionTags.map((permission) => (
                    <PermBadge key={permission} label={permission} />
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Sin permisos asignados"
                />
              )}
            </Card>
          </div>
        </div>

        {/* ── Branches ────────────────────────────────────────────────────── */}
        <Card
          title={
            <Space>
              <span style={{ color: "var(--color-text-primary)" }}>
                Sucursales asignadas
              </span>
              {branchList.length > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>
                  {branchList.length}
                </Tag>
              )}
            </Space>
          }
          style={cardBase}
        >
          {branchList.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {branchList.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          ) : (
            <Empty description="No hay sucursales asignadas" />
          )}
        </Card>
      </div>

      {/* ── Password Modal ───────────────────────────────────────────────── */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        loading={isChangingPassword}
      />
    </div>
  );
};

export default ProfilePage;
