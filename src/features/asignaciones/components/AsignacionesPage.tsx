// src/features/asignaciones/components/AsignacionesPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Input,
  Button,
  Empty,
  Spin,
  Avatar,
  Badge,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { Plus, Trash2, Search, Crown } from "lucide-react";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import { asignacionesService } from "@/features/sucursales/services/asignaciones.service";
import { Can } from "@/shared/components/atoms/Can";
import { toast } from "react-toastify";
import type { SucursalListItem, SucursalUsuario } from "@/features/sucursales/types/sucursal.types";
import type { UsuarioListItem } from "@/features/usuarios/types/usuario.types";

// ─── Utility: Color único por usuario ────────────────────────────────────────
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B88B",
  "#95E1D3",
];

const getUserColor = (userId: number): string => {
  return COLORS[userId % COLORS.length];
};

const getUserInitials = (nombre: string, apellido?: string): string => {
  const first = nombre?.charAt(0)?.toUpperCase() || "?";
  const second =
    apellido?.charAt(0)?.toUpperCase() ||
    nombre?.charAt(1)?.toUpperCase() ||
    "";
  return first + second;
};

// ─── Tipo para usuario con asignación ────────────────────────────────────────
interface UsuarioConAsignacion extends UsuarioListItem {
  asignado: boolean;
  es_administrador: boolean;
  loading?: boolean;
}

export const AsignacionesPage = () => {
  const [sucursales, setSucursales] = useState<SucursalListItem[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioConAsignacion[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchAsignados, setSearchAsignados] = useState("");
  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    usuarioId: number;
    usuarioUsername: string;
  } | null>(null);

  // Cargar sucursales al montar
useEffect(() => {
  const loadSucursales = async () => {
    setLoading(true);
    try {
      const res = await sucursalesService.getAll({ per_page: 100 });
      const lista = res.data ?? [];
      setSucursales(lista);
      if (lista.length > 0) setSelectedSucursal(lista[0].id);
    } catch {
      toast.error("Error al cargar sucursales");
    } finally {
      setLoading(false);
    }
  };
  loadSucursales();
}, []);

  // Cargar usuarios cuando cambia la sucursal seleccionada
  useEffect(() => {
    if (!selectedSucursal) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar en paralelo:
        // 1. Todos los usuarios del sistema
        // 2. Detalle de la sucursal con usuarios asignados
        const [allUsersRes, sucursalRes] = await Promise.all([
          usuariosService.getAll({ per_page: 100 }),
          sucursalesService.getById(selectedSucursal), // GET /sucursales/:id con usuarios
        ]);

        const allUsers = allUsersRes.data ?? [];
        // Obtener usuarios asignados desde sucursal.usuarios
        const asignados = sucursalRes.data.usuarios ?? [];
        const asignadosIds = new Set(asignados.map((a: any) => a.id));

        const usuariosConEstado: UsuarioConAsignacion[] = allUsers.map(
          (u: any) => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            username: u.username,
            email: u.email,
            activo: u.activo,
            es_administrador: u.es_administrador,
            asignado: asignadosIds.has(u.id),
          }),
        );

        setUsuarios(usuariosConEstado);
      } catch {
        toast.error("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSucursal]);

  // Filtrar usuarios asignados
  const usuariosAsignados = useMemo(() => {
    return usuarios
      .filter((u) => u.asignado)
      .filter((u) => {
        const search = searchAsignados.toLowerCase();
        return (
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          `${u.nombre} ${u.apellido || ""}`.toLowerCase().includes(search)
        );
      });
  }, [usuarios, searchAsignados]);

  // Filtrar usuarios disponibles
  const usuariosDisponibles = useMemo(() => {
    return usuarios
      .filter((u) => !u.asignado)
      .filter((u) => {
        const search = searchDisponibles.toLowerCase();
        return (
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          `${u.nombre} ${u.apellido || ""}`.toLowerCase().includes(search)
        );
      });
  }, [usuarios, searchDisponibles]);

  // Asignar usuario
  const handleAsignar = async (usuarioId: number) => {
    if (!selectedSucursal) return;
    setLoadingUsers((prev) => ({ ...prev, [usuarioId]: true }));
    try {
      // POST /asignaciones — asignar usuario a sucursal
      await asignacionesService.asignar({
        usuario_id: usuarioId,
        sucursal_id: selectedSucursal,
      });
      toast.success("Usuario asignado correctamente");
      // Actualizar estado local
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, asignado: true } : u)),
      );
    } catch {
      toast.error("Error al asignar usuario");
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

  // Desasignar usuario
  const handleDesasignar = async (usuarioId: number) => {
    if (!selectedSucursal) return;
    setLoadingUsers((prev) => ({ ...prev, [usuarioId]: true }));
    try {
      // DELETE /asignaciones/:usuario_id/:sucursal_id — quitar usuario de sucursal
      await asignacionesService.quitar(usuarioId, selectedSucursal);
      toast.success("Usuario desasignado correctamente");
      // Actualizar estado local
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, asignado: false } : u)),
      );
      setDeleteConfirm(null);
    } catch {
      toast.error("Error al desasignar usuario");
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const sucursalSeleccionada = sucursales.find(
    (s) => s.id === selectedSucursal,
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600 }}>
          Asignaciones de Usuarios
        </h1>
        <p
          style={{
            margin: "8px 0 0 0",
            color: "var(--color-text-secondary)",
          }}
        >
          Gestiona qué usuarios trabajan en cada sucursal
        </p>
      </div>

      {/* Selector de sucursal */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Sucursal
            </label>
            <Select
              value={selectedSucursal}
              onChange={setSelectedSucursal}
              style={{ width: "100%", maxWidth: "400px" }}
              placeholder="Selecciona una sucursal"
              options={sucursales.map((s) => ({
                label: `${s.nombre} (${s.codigo})`,
                value: s.id,
              }))}
            />
          </div>
          {sucursalSeleccionada && (
            <div
              style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
            >
              <strong>Sucursal Activa:</strong> {sucursalSeleccionada.nombre}
            </div>
          )}
        </Space>
      </Card>

      {/* Panel dividido */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          maxWidth: "1400px",
        }}
      >
        {/* Columna Izquierda: Usuarios Asignados */}
        <Card
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            height: "auto",
            minHeight: "400px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                Usuarios Asignados
              </h3>
              <Badge
                count={usuariosAsignados.length}
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                }}
              />
            </div>
            <Input
              placeholder="Buscar usuario..."
              prefix={<Search size={16} />}
              value={searchAsignados}
              onChange={(e) => setSearchAsignados(e.target.value)}
              style={{ borderRadius: "var(--radius-card)" }}
            />
          </div>

          {/* Lista con scroll — máximo 5 usuarios visibles */}
          <div
            style={{
              maxHeight: usuariosAsignados.length > 5 ? "340px" : "auto",
              overflowY: usuariosAsignados.length > 5 ? "auto" : "visible",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {usuariosAsignados.length === 0 ? (
              <Empty
                description="Sin usuarios asignados"
                style={{ margin: "auto" }}
              />
            ) : (
              usuariosAsignados.map((usuario) => (
                <div
                  key={usuario.id}
                  style={{
                    padding: "12px",
                    backgroundColor: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      style={{
                        backgroundColor: getUserColor(usuario.id),
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {getUserInitials(usuario.nombre, usuario.apellido)}
                    </Avatar>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "4px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{usuario.username}
                        </p>
                        {usuario.es_administrador && (
                          <Crown size={14} style={{ color: "#DAA520" }} />
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {usuario.email}
                      </p>
                    </div>

                    {/* Badge de estado */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Badge
                        color={usuario.activo ? "#52c41a" : "#f5222d"}
                        style={{ width: "8px", height: "8px" }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: usuario.activo
                            ? "var(--color-text-secondary)"
                            : "#f5222d",
                        }}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  {/* Botón desasignar */}
                  <Can permission="asignaciones.eliminar">
                    <Popconfirm
                      title="¿Desasignar usuario?"
                      description={`¿Quitar a ${usuario.username} de esta sucursal?`}
                      okText="Desasignar"
                      cancelText="Cancelar"
                      open={deleteConfirm?.usuarioId === usuario.id}
                      onConfirm={() => handleDesasignar(usuario.id)}
                      onCancel={() => setDeleteConfirm(null)}
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<Trash2 size={16} />}
                        loading={loadingUsers[usuario.id]}
                        onClick={() =>
                          setDeleteConfirm({
                            usuarioId: usuario.id,
                            usuarioUsername: usuario.username,
                          })
                        }
                      />
                    </Popconfirm>
                  </Can>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Columna Derecha: Usuarios Disponibles */}
        <Card
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            height: "auto",
            minHeight: "400px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                Usuarios Disponibles
              </h3>
              <Badge
                count={usuariosDisponibles.length}
                style={{
                  backgroundColor: "var(--color-warning)",
                  color: "white",
                }}
              />
            </div>
            <Input
              placeholder="Buscar usuario..."
              prefix={<Search size={16} />}
              value={searchDisponibles}
              onChange={(e) => setSearchDisponibles(e.target.value)}
              style={{ borderRadius: "var(--radius-card)" }}
            />
          </div>

          {/* Lista con scroll — máximo 5 usuarios visibles */}
          <div
            style={{
              maxHeight: usuariosDisponibles.length > 5 ? "340px" : "auto",
              overflowY: usuariosDisponibles.length > 5 ? "auto" : "visible",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {usuariosDisponibles.length === 0 ? (
              <Empty
                description="Todos los usuarios están asignados"
                style={{ margin: "auto" }}
              />
            ) : (
              usuariosDisponibles.map((usuario) => (
                <div
                  key={usuario.id}
                  style={{
                    padding: "12px",
                    backgroundColor: "var(--color-bg-secondary)",
                    borderRadius: "var(--radius-card)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      style={{
                        backgroundColor: getUserColor(usuario.id),
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {getUserInitials(usuario.nombre, usuario.apellido)}
                    </Avatar>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "4px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{usuario.username}
                        </p>
                        {usuario.es_administrador && (
                          <Crown size={14} style={{ color: "#DAA520" }} />
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {usuario.email}
                      </p>
                    </div>

                    {/* Badge de estado */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Badge
                        color={usuario.activo ? "#52c41a" : "#f5222d"}
                        style={{ width: "8px", height: "8px" }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: usuario.activo
                            ? "var(--color-text-secondary)"
                            : "#f5222d",
                        }}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  {/* Botón asignar */}
                  <Can permission="asignaciones.crear">
                    <Button
                      type="primary"
                      size="small"
                      icon={<Plus size={16} />}
                      loading={loadingUsers[usuario.id]}
                      onClick={() => handleAsignar(usuario.id)}
                    />
                  </Can>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AsignacionesPage;
