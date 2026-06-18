import { useEffect, useState } from "react";
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
} from "antd";
import { UserPlus, UserMinus, Search, Crown } from "lucide-react";
import { toast } from "react-toastify";

import { useAsignaciones } from "../hooks/useAsignaciones";
import { Can } from "@/shared/components/guards/Can";
import { useAuth } from "@/shared/hooks/useAuth";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";

import type { UsuarioListItem } from "@/features/usuarios/types/usuario.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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

const getUserColor = (userId: number): string => COLORS[userId % COLORS.length];

const getUserInitials = (nombre: string, apellido?: string): string => {
  const first = nombre?.charAt(0)?.toUpperCase() || "?";
  const second =
    apellido?.charAt(0)?.toUpperCase() ||
    nombre?.charAt(1)?.toUpperCase() ||
    "";
  return first + second;
};

const isAdminUser = (usuario: UsuarioListItem): boolean =>
  (usuario.roles ?? []).includes("admin");

const matchesSearch = (usuario: UsuarioListItem, search: string): boolean => {
  const q = search.toLowerCase();
  return (
    usuario.username.toLowerCase().includes(q) ||
    usuario.email.toLowerCase().includes(q) ||
    `${usuario.persona?.nombre ?? ""} ${usuario.persona?.apellido ?? ""}`
      .toLowerCase()
      .includes(q)
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMPONENTE PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const AsignacionesPage = () => {
  const { asignar, quitar } = useAsignaciones();
  const { sucursales: misSucursales } = useAuth();
  const activeSucursales = misSucursales.filter(s => s.activa);

  // Estado esencial
  const [usuarios, setUsuarios] = useState<UsuarioListItem[]>([]);
  const [asignadosIds, setAsignadosIds] = useState<Set<number>>(new Set());
  const [selectedSucursal, setSelectedSucursal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchAsignados, setSearchAsignados] = useState("");
  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CARGA INICIAL - SUCURSALES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  useEffect(() => {
    if (activeSucursales.length > 0 && !selectedSucursal) {
      setSelectedSucursal(activeSucursales[0].id);
    }
  }, [activeSucursales, selectedSucursal]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CARGA DE DATOS AL CAMBIAR SUCURSAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  useEffect(() => {
    if (!selectedSucursal) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [allUsersRes, sucursalRes] = await Promise.all([
          usuariosService.getAll({ per_page: 100 }),
          sucursalesService.getById(selectedSucursal),
        ]);

        const allUsers = (allUsersRes.data ?? []).filter((u) => u.activo === true);
        const asignados = sucursalRes.data.usuarios ?? [];

        setUsuarios(allUsers);
        setAsignadosIds(new Set(asignados.map((a) => a.id)));
        setSearchAsignados("");
        setSearchDisponibles("");
      } catch {
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSucursal]);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FUNCIONES CALCULADAS (filtros en línea)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const usuariosAsignados = usuarios
    .filter((u) => asignadosIds.has(u.id))
    .filter((u) => matchesSearch(u, searchAsignados));

  const usuariosDisponibles = usuarios
    .filter((u) => !asignadosIds.has(u.id))
    .filter((u) => matchesSearch(u, searchDisponibles));

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ACCIONES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const handleAsignar = async (usuarioId: number) => {
    if (!selectedSucursal) return;

    setLoadingUsers((prev) => ({ ...prev, [usuarioId]: true }));
    try {
      const ok = await asignar(usuarioId, selectedSucursal);
      if (ok) {
        setAsignadosIds((prev) => new Set([...prev, usuarioId]));
      }
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

  const handleDesasignar = async (usuarioId: number) => {
    if (!selectedSucursal) return;

    // Validación: no permitir desasignar administradores
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (usuario && isAdminUser(usuario)) {
      toast.error("No se puede desasignar administradores");
      return;
    }

    setLoadingUsers((prev) => ({ ...prev, [usuarioId]: true }));
    try {
      const ok = await quitar(selectedSucursal, usuarioId);
      if (ok) {
        setAsignadosIds((prev) => {
          const next = new Set(prev);
          next.delete(usuarioId);
          return next;
        });
      }
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     RENDER - CARD DE USUARIO
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const UsuarioCard = ({
    usuario,
    accion,
  }: {
    usuario: UsuarioListItem;
    accion: React.ReactNode;
  }) => {
    const esAdmin = isAdminUser(usuario);
    return (
      <div
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
          <Avatar
            style={{
              backgroundColor: getUserColor(usuario.id),
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {getUserInitials(
              usuario.persona?.nombre ?? usuario.username,
              usuario.persona?.apellido ?? "",
            )}
          </Avatar>

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
              {esAdmin && <Crown size={14} style={{ color: "#DAA520" }} />}
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

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Badge color={usuario.activo ? "#52c41a" : "#f5222d"} />
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

        {accion}
      </div>
    );
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     RENDER PRINCIPAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const sucursalSeleccionada = activeSucursales.find(
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
          style={{ margin: "8px 0 0 0", color: "var(--color-text-secondary)" }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
              options={activeSucursales.map((s) => ({
                label: `${s.nombre} ${s.clave ? `(${s.clave})` : ""}`,
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
        </div>
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
        {/* Columna: Asignados */}
        <Card
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
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
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  accion={
                    <Can permission="asignaciones.eliminar">
                      <Popconfirm
                        title="¿Desasignar usuario?"
                        description={`¿Quitar a ${usuario.username} de esta sucursal?`}
                        okText="Desasignar"
                        cancelText="Cancelar"
                        onConfirm={() => handleDesasignar(usuario.id)}
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<UserMinus size={16} />}
                          loading={loadingUsers[usuario.id]}
                          disabled={isAdminUser(usuario)}
                          title={
                            isAdminUser(usuario)
                              ? "No se puede desasignar administradores"
                              : ""
                          }
                        />
                      </Popconfirm>
                    </Can>
                  }
                />
              ))
            )}
          </div>
        </Card>

        {/* Columna: Disponibles */}
        <Card
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
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
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  accion={
                    <Can permission="asignaciones.crear">
                      <Button
                        type="primary"
                        size="small"
                        icon={<UserPlus size={16} />}
                        loading={loadingUsers[usuario.id]}
                        onClick={() => handleAsignar(usuario.id)}
                      />
                    </Can>
                  }
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AsignacionesPage;
