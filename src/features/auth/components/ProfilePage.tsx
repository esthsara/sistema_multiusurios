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
  Space,
  Tag,
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
  LogIn,
  MapPin,
  Phone,
  RefreshCw,
  User,
  Users,
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

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(date);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const infoItemStyle = {
  background: "var(--color-bg-base-2)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  padding: 16,
  height: "100%",
} as const;

const cardBaseStyle = {
  background: "var(--color-bg-base-2)",
  borderColor: "var(--color-border)",
  boxShadow: "var(--shadow-card)",
} as const;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, sucursalActiva, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();
  const [passwordForm] = Form.useForm<ChangePasswordDto>();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
          {
            trim: false,
            maxLength: 256,
            stripTags: false,
          },
        ),
      };

      await authService.changePassword(dto);
      passwordForm.resetFields();
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

  const photoLabel = user?.persona.fotoPatch
    ? safeText(user.persona.fotoPatch, "Sin foto", 120)
    : "Sin foto";

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-[10px]">
        <Card
          className="shadow-none"
          styles={{
            body: {
              background: "var(--color-bg-base-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
            },
          }}
        >
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
                    fontSize: 24,
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
                <Space wrap size={[8, 8]} style={{ marginTop: 8 }}>
                  <Tag color="blue" icon={<User size={12} />}>
                    {username}
                  </Tag>
                  <Tag
                    color={user?.activo ? "green" : "red"}
                    icon={<BadgeCheck size={12} />}
                  >
                    {user?.activo ? "Usuario activo" : "Usuario inactivo"}
                  </Tag>
                  <Tag color="geekblue" icon={<Shield size={12} />}>
                    {primaryRole}
                  </Tag>
                </Space>
                <Paragraph
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Vista completa del perfil con la información disponible en la
                  sesión actual.
                </Paragraph>
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
              <Button danger onClick={logout}>
                Cerrar sesión
              </Button>
            </Space>
          </div>
        </Card>

        <div className="grid gap-[10px] xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-[40px]">
            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Datos personales
                </span>
              }
              style={cardBaseStyle}
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item
                  label={
                    <span>
                      <IdCard size={14} /> Documento principal
                    </span>
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
                    <span>
                      <Mail size={14} /> Correo electrónico
                    </span>
                  }
                >
                  {email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <User size={14} /> Usuario
                    </span>
                  }
                >
                  {username}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Building2 size={14} /> Tipo de persona
                    </span>
                  }
                >
                  {personType}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <MapPin size={14} /> Estado de persona
                    </span>
                  }
                >
                  {personStatus}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Phone size={14} /> Fecha de nacimiento
                    </span>
                  }
                >
                  {formatDate(user?.persona.fechaNacimiento)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Fingerprint size={14} /> Género
                    </span>
                  }
                >
                  {safeText(user?.persona.genero, "No disponible", 120)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <KeyRound size={14} /> Foto de perfil
                    </span>
                  }
                >
                  {photoLabel}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Seguridad y sesión
                </span>
              }
              style={cardBaseStyle}
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item
                  label={
                    <span>
                      <KeyRound size={14} /> Estado de autenticación
                    </span>
                  }
                >
                  {isAuthenticated ? "Autenticado" : "No autenticado"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <LogIn size={14} /> Inicio de sesión
                    </span>
                  }
                >
                  {formatDateTime(loginTime)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Shield size={14} /> ID de sesión
                    </span>
                  }
                >
                  {user?.sessionId ?? "No disponible"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Building2 size={14} /> Sucursal activa
                    </span>
                  }
                >
                  {sucursalActiva
                    ? `${sucursalActiva.nombre} (${sucursalActiva.clave})`
                    : "No hay sucursal activa"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <Users size={14} /> Sucursales asignadas
                    </span>
                  }
                >
                  {branchList.length}
                </Descriptions.Item>
              </Descriptions>

              <Divider
                style={{
                  margin: "18px 0",
                  borderColor: "var(--color-border)",
                }}
              />

              <div style={infoItemStyle}>
                <Title
                  level={5}
                  style={{ marginTop: 0, color: "var(--color-text-primary)" }}
                >
                  Cambiar contraseña
                </Title>
                <Paragraph
                  style={{ marginTop: 8, color: "var(--color-text-secondary)" }}
                >
                  Por seguridad se solicita tu contraseña actual antes de
                  registrar una nueva.
                </Paragraph>

                <Alert
                  type="info"
                  showIcon
                  style={{ marginBottom: 14 }}
                  message="Al cambiarla, tu sesión actual se cerrará automáticamente."
                />

                <Form
                  form={passwordForm}
                  layout="vertical"
                  requiredMark={false}
                  autoComplete="off"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="current_password"
                    label="Contraseña actual"
                    rules={[
                      {
                        required: true,
                        message: "Ingresa tu contraseña actual",
                      },
                    ]}
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
                      {
                        required: true,
                        message: "Ingresa la nueva contraseña",
                      },
                      {
                        min: 8,
                        message: "Debe tener al menos 8 caracteres",
                      },
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
                      {
                        required: true,
                        message: "Confirma la nueva contraseña",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }
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

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isChangingPassword}
                    style={{ height: 42, fontWeight: 600 }}
                  >
                    {isChangingPassword
                      ? "Actualizando..."
                      : "Actualizar contraseña"}
                  </Button>
                </Form>
              </div>
            </Card>
          </div>

          <div className="space-y-[28px]">
            <Card
              title={
                <span style={{ color: "var(--color-text-primary)" }}>
                  Resumen rápido
                </span>
              }
              style={cardBaseStyle}
            >
              <div className="space-y-3">
                <div style={infoItemStyle}>
                  <Text type="secondary">Nombre completo</Text>
                  <div
                    style={{
                      color: "var(--color-text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    {displayName}
                  </div>
                </div>
                <div style={infoItemStyle}>
                  <Text type="secondary">Correo</Text>
                  <div
                    style={{
                      color: "var(--color-text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    {email}
                  </div>
                </div>
                <div style={infoItemStyle}>
                  <Text type="secondary">Rol principal</Text>
                  <div
                    style={{
                      color: "var(--color-text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    {primaryRole}
                  </div>
                </div>
                <div style={infoItemStyle}>
                  <Text type="secondary">Permisos</Text>
                  <div
                    style={{
                      color: "var(--color-text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    {permissionTags.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <span style={{ color: "var(--color-text-primary) " }}>
                  Roles y permisos
                </span>
              }
              style={cardBaseStyle}
              className="space-y-[28px]"
            >
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <div>
                  <Text type="secondary">Roles</Text>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {roleTags.length > 0 ? (
                      roleTags.map((role) => (
                        <Tag
                          key={`${role.id}-${role.name}`}
                          color="geekblue"
                          icon={<Shield size={12} />}
                        >
                          {role.name}
                        </Tag>
                      ))
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin roles asignados"
                      />
                    )}
                  </div>
                </div>

                <Divider
                  style={{
                    margin: "30px 0",
                    borderColor: "var(--color-border)",
                  }}
                />

                <div>
                  <Text type="secondary">Permisos</Text>
                  <List
                    size="small"
                    bordered={false}
                    style={{ maxHeight: 280, overflowY: "auto" }}
                    dataSource={permissionTags}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="Sin permisos asignados"
                        />
                      ),
                    }}
                    renderItem={(permission) => (
                      <List.Item
                        style={{
                          paddingInline: 0,
                          borderBottomColor: "var(--color-border)",
                        }}
                      >
                        <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                          {permission}
                        </Tag>
                      </List.Item>
                    )}
                  />
                </div>
              </Space>
            </Card>
          </div>
        </div>

        <Card
          title={
            <span style={{ color: "var(--color-text-primary)" }}>
              Sucursales asignadas
            </span>
          }
          style={cardBaseStyle}
        >
          {branchList.length > 0 ? (
            <div className="grid gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {branchList.map((branch) => (
                <div
                  key={branch.id}
                  style={{
                    ...infoItemStyle,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Text strong style={{ color: "var(--color-text-primary)" }}>
                    {branch.nombre}
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No hay sucursales asignadas" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
