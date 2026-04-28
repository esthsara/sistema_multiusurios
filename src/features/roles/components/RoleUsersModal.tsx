// src/features/roles/components/RoleUsersModal.tsx
/**
 * RoleUsersModal — Visualiza y gestiona la asignación de usuarios al rol seleccionado.
 *
 * Flujo intuitivo:
 * - Lista los usuarios que ya tienen el rol (tabla)
 * - Permite quitar el rol a uno o varios usuarios con un click
 * - (si hay usuarios en el sistema sin ese rol) permite asignar el rol a un usuario
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Empty,
  Flex,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CheckCircle,
  Mail,
  Search,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { rolesService } from "../services/roles.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import type { RolListItem, RolUsuarioItem } from "../types/rol.types";

const { Title, Text } = Typography;

interface RoleUsersModalProps {
  open: boolean;
  role: RolListItem | null;
  users: RolUsuarioItem[];
  loading: boolean;
  onClose: () => void;
  /** Callback opcional para refrescar la lista de usuarios del rol tras cambios */
  onRefresh?: () => void;
}

const getDisplayName = (user: RolUsuarioItem) => {
  const persona = user.persona;
  if (!persona) return user.username;
  if (persona.nombre_completo) return persona.nombre_completo;
  if (persona.razon_social) return persona.razon_social;
  const fullName = `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim();
  return fullName || user.username;
};

const getUserInitials = (user: RolUsuarioItem): string => {
  const name = getDisplayName(user);
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/** Paleta de avatares por inicial */
const AVATAR_COLORS = [
  "var(--color-primary-600)",
  "var(--tag-purple-text)",
  "var(--tag-cyan-text)",
  "var(--tag-gold-text)",
  "var(--tag-magenta-text)",
  "var(--tag-geekblue-text)",
];
const getAvatarColor = (id: number) =>
  AVATAR_COLORS[id % AVATAR_COLORS.length];

export const RoleUsersModal = ({
  open,
  role,
  users,
  loading,
  onClose,
  onRefresh,
}: RoleUsersModalProps) => {
  const { token } = theme.useToken();
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  /* ── Asignación de nuevo usuario ── */
  const [allUsers, setAllUsers] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [selectedNewUserId, setSelectedNewUserId] = useState<number | null>(
    null,
  );
  const [assigning, setAssigning] = useState(false);

  /** Carga la lista completa de usuarios para el select de asignación */
  const fetchAllUsers = useCallback(async () => {
    setLoadingAllUsers(true);
    try {
      const res = await usuariosService.getAll({ per_page: 300 });
      const lista = Array.isArray(res.data) ? res.data : [];
      setAllUsers(
        lista.map((u) => ({
          id: u.id,
          label: `${u.username} — ${u.email}`,
        })),
      );
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoadingAllUsers(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchAllUsers();
      setSearch("");
      setSelectedNewUserId(null);
    }
  }, [open, fetchAllUsers]);

  /** Usuarios ya asignados filtrados por búsqueda */
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        getDisplayName(u).toLowerCase().includes(q),
    );
  }, [users, search]);

  /** Usuarios del select (excluye los que ya tienen el rol) */
  const availableToAssign = useMemo(() => {
    const currentIds = new Set(users.map((u) => u.id));
    return allUsers.filter((u) => !currentIds.has(u.id));
  }, [allUsers, users]);

  /** Quitar rol de un usuario */
  const handleRemoveRole = async (userId: number) => {
    if (!role) return;
    setRemovingId(userId);
    try {
      await rolesService.removeRoleFromUser(userId, { role_id: [role.id] });
      toast.success("Rol removido correctamente");
      onRefresh?.();
    } catch {
      toast.error("Error al quitar el rol");
    } finally {
      setRemovingId(null);
    }
  };

  /** Asignar rol a un nuevo usuario */
  const handleAssignRole = async () => {
    if (!role || !selectedNewUserId) return;
    setAssigning(true);
    try {
      await rolesService.assignRoleToUser(selectedNewUserId, {
        role_id: [role.id],
      });
      toast.success("Rol asignado exitosamente");
      setSelectedNewUserId(null);
      onRefresh?.();
    } catch {
      toast.error("Error al asignar el rol");
    } finally {
      setAssigning(false);
    }
  };

  const columns: TableColumnsType<RolUsuarioItem> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, user) => (
        <Flex align="center" gap={12}>
          <Avatar
            size={38}
            style={{
              backgroundColor: getAvatarColor(user.id),
              flexShrink: 0,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {getUserInitials(user)}
          </Avatar>
          <Flex vertical gap={2}>
            <Text strong style={{ color: "var(--color-text-primary)" }}>
              {getDisplayName(user)}
            </Text>
            <Space size={4}>
              <Text
                type="secondary"
                style={{ fontSize: 12 }}
              >{`@${user.username}`}</Text>
              {user.email && (
                <Tag
                  icon={<Mail size={11} />}
                  style={{
                    fontSize: 11,
                    borderRadius: "var(--radius-md)",
                    background: "var(--tag-neutral-bg)",
                    color: "var(--tag-neutral-text)",
                    border: "1px solid var(--tag-neutral-border)",
                  }}
                >
                  {user.email}
                </Tag>
              )}
            </Space>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      width: 110,
      align: "center",
      render: (activo?: boolean) =>
        activo !== false ? (
          <Tag
            icon={<CheckCircle size={12} />}
            style={{
              background: "var(--color-alert-success-bg)",
              color: "var(--color-success-500)",
              border: "1px solid var(--tag-success-border)",
              borderRadius: "var(--radius-md)",
              padding: "2px 10px",
              fontWeight: 600,
            }}
          >
            Activo
          </Tag>
        ) : (
          <Tag
            icon={<XCircle size={12} />}
            style={{
              background: "var(--color-alert-danger-bg)",
              color: "var(--color-danger-500)",
              border: "1px solid var(--tag-danger-border)",
              borderRadius: "var(--radius-md)",
              padding: "2px 10px",
              fontWeight: 600,
            }}
          >
            Inactivo
          </Tag>
        ),
    },
    {
      title: "",
      key: "acciones",
      width: 60,
      align: "center",
      render: (_, user) => (
        <Popconfirm
          title={`¿Quitar el rol "${role?.name}" a este usuario?`}
          okText="Quitar"
          cancelText="No"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleRemoveRole(user.id)}
        >
          <Tooltip title="Quitar rol">
            <Button
              type="text"
              danger
              size="small"
              loading={removingId === user.id}
              icon={<UserMinus size={15} />}
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={860}
      centered
      destroyOnClose
      title={
        <Flex align="center" gap={12}>
          <Users size={22} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {role ? `Usuarios con rol: ${role.name}` : "Usuarios del rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Gestiona quién tiene asignado este rol
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: 0 },
      }}
    >
      {/* ── Asignar nuevo usuario ── */}
      <div
        style={{
          padding: "16px 24px",
          background: "var(--color-bg-base-2)",
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Text
          strong
          style={{
            display: "block",
            marginBottom: 8,
            color: "var(--color-text-primary)",
          }}
        >
          <UserPlus
            size={14}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Asignar rol a un usuario
        </Text>
        <Flex gap={8}>
          <Select
            showSearch
            placeholder="Buscar usuario para asignarle este rol..."
            value={selectedNewUserId ?? undefined}
            onChange={setSelectedNewUserId}
            loading={loadingAllUsers}
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={availableToAssign.map((u) => ({
              value: u.id,
              label: u.label,
            }))}
            style={{ flex: 1 }}
            allowClear
            notFoundContent={
              <Text type="secondary" style={{ fontSize: 12 }}>
                {loadingAllUsers
                  ? "Cargando..."
                  : "Todos los usuarios ya tienen este rol"}
              </Text>
            }
          />
          <Button
            type="primary"
            icon={<UserPlus size={15} />}
            onClick={handleAssignRole}
            loading={assigning}
            disabled={!selectedNewUserId}
          >
            Asignar
          </Button>
        </Flex>
      </div>

      {/* ── Lista de usuarios con el rol ── */}
      <div style={{ padding: "12px 24px 20px" }}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 12 }}
        >
          <Text strong>
            Usuarios asignados{" "}
            <Tag style={{ fontWeight: 700, borderRadius: "var(--radius-md)" }}>
              {users.length}
            </Tag>
          </Text>
          <Input
            placeholder="Buscar en la lista..."
            prefix={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 220 }}
            size="small"
          />
        </Flex>

        <Table<RolUsuarioItem>
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          size="small"
          locale={{
            emptyText: (
              <Empty
                description={
                  role
                    ? `No hay usuarios asignados al rol "${role.name}"`
                    : "Sin usuarios"
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: "24px 0" }}
              />
            ),
          }}
          components={{
            header: {
              cell: (props: React.HTMLAttributes<HTMLElement>) => (
                <th
                  {...props}
                  style={{
                    ...(props.style ?? {}),
                    background: "var(--color-bg-overlay)",
                    color: "var(--color-text-primary)",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </Modal>
  );
};
