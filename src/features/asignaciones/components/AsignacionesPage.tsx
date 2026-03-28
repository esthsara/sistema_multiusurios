// src/features/asignaciones/components/AsignacionesPage.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Empty,
  Spin,
  Tag,
  Popconfirm,
  Badge,
} from "antd";
import { Plus, Trash2 } from "lucide-react";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import { AsignacionModal } from "./AsignacionModal";
import { Can } from "@/shared/components/atoms/Can";
import type { AsignacionListItem } from "../types/asignacion.types";

export const AsignacionesPage = () => {
  const { data: asignaciones, loading, create, remove } = useAsignaciones();
  const { data: roles, loading: loadingRoles } = useRoles();

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<number | null>(null);
  const [searchUser, setSearchUser] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AsignacionListItem | null>(
    null,
  );

  // Cargar usuarios y sucursales
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [usersRes, sucursalesRes] = await Promise.all([
          usuariosService.getAll({ per_page: 100 }),
          sucursalesService.getAll({ per_page: 100 }),
        ]);
        setUsuarios(usersRes.data ?? []);
        setSucursales(sucursalesRes.data ?? []);
      } catch {
        // Errores ya manejados en servicios
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Agrupar asignaciones por sucursal
  const asignacionesBySucursal = sucursales.map((sucursal) => ({
    ...sucursal,
    asignaciones: asignaciones.filter(
      (a: AsignacionListItem) => a.sucursal_id === sucursal.id,
    ),
  }));

  const handleAddUsuario = (sucursalId: number) => {
    setSelectedSucursal(sucursalId);
    setModalOpen(true);
  };

  const handleCreateAsignacion = async (data: {
    usuario_id: number;
    rol_id: number;
  }) => {
    if (!selectedSucursal) return;
    const success = await create(
      data.usuario_id,
      selectedSucursal,
      data.rol_id,
    );
    if (success) {
      setModalOpen(false);
      setSelectedSucursal(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await remove(deleteTarget.id);
    if (success) {
      setDeleteTarget(null);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600 }}>
            Asignaciones de Usuarios
          </h1>
          <p
            style={{
              margin: "8px 0 0 0",
              color: "var(--color-text-secondary)",
            }}
          >
            Gestiona qué usuarios trabajan en cada sucursal y sus roles
          </p>
        </div>
      </div>

      {/* Filtro de búsqueda */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
        }}
      >
        <Input
          placeholder="Buscar usuario por nombre, email o username..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value.toLowerCase())}
          style={{ maxWidth: "400px" }}
        />
      </Card>

      {/* Grid de sucursales */}
      {asignacionesBySucursal.length === 0 ? (
        <Empty
          description="No hay sucursales disponibles"
          style={{ marginTop: "48px" }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {asignacionesBySucursal
            .filter(
              (s) =>
                s.nombre.toLowerCase().includes(searchUser) ||
                s.codigo.toLowerCase().includes(searchUser),
            )
            .map((sucursal) => (
              <Col key={sucursal.id} xs={24} sm={12} lg={8}>
                <Card
                  className="h-full"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-bg-secondary)",
                    cursor: "default",
                    transition: "all 0.3s ease",
                  }}
                  hoverable
                >
                  {/* Encabezado de sucursal */}
                  <div
                    style={{
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid var(--color-border)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {sucursal.nombre}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      Código: {sucursal.codigo}
                    </p>
                  </div>

                  {/* Badge de usuarios */}
                  <div style={{ marginBottom: "16px" }}>
                    <Badge
                      count={sucursal.asignaciones.length}
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        fontSize: "14px",
                        padding: "4px 8px",
                        borderRadius: "8px",
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "var(--color-text-secondary)",
                        fontSize: "14px",
                      }}
                    >
                      {sucursal.asignaciones.length === 1
                        ? "usuario asignado"
                        : "usuarios asignados"}
                    </span>
                  </div>

                  {/* Lista de usuarios */}
                  {sucursal.asignaciones.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "var(--color-bg-tertiary)",
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "var(--color-text-secondary)",
                          fontSize: "14px",
                        }}
                      >
                        Sin usuarios asignados
                      </p>
                    </div>
                  ) : (
                    <div style={{ marginBottom: "16px" }}>
                      {sucursal.asignaciones.map(
                        (asignacion: AsignacionListItem) => (
                          <div
                            key={asignacion.id}
                            style={{
                              padding: "12px",
                              marginBottom: "8px",
                              backgroundColor: "var(--color-bg-primary)",
                              borderRadius: "8px",
                              border: "1px solid var(--color-border)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: "var(--color-text-primary)",
                                }}
                              >
                                @{asignacion.usuario?.username}
                              </p>
                              <p
                                style={{
                                  margin: "0 0 6px 0",
                                  fontSize: "12px",
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                {asignacion.usuario?.email}
                              </p>
                              {asignacion.rol && (
                                <Tag
                                  color="var(--color-primary)"
                                  style={{
                                    color: "white",
                                    marginTop: "4px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {asignacion.rol.name}
                                </Tag>
                              )}
                            </div>
                            <Can permission="asignaciones.eliminar">
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<Trash2 size={14} />}
                                onClick={() => setDeleteTarget(asignacion)}
                              />
                            </Can>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Botón agregar usuario */}
                  <Can permission="asignaciones.crear">
                    <Button
                      type="primary"
                      block
                      icon={<Plus size={16} />}
                      onClick={() => handleAddUsuario(sucursal.id)}
                      style={{
                        borderRadius: "8px",
                        height: "40px",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Agregar Usuario
                    </Button>
                  </Can>
                </Card>
              </Col>
            ))}
        </Row>
      )}

      {/* Modal para agregar usuario */}
      {selectedSucursal && (
        <AsignacionModal
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setSelectedSucursal(null);
          }}
          usuarios={usuarios}
          roles={roles}
          loading={loading || loadingRoles}
          onSubmit={handleCreateAsignacion}
          sucursal={sucursales.find((s) => s.id === selectedSucursal)}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteTarget && (
        <Popconfirm
          title="¿Quitar asignación?"
          description={`¿Deseas quitar a ${deleteTarget.usuario?.username} de ${deleteTarget.sucursal?.nombre}?`}
          okText="Quitar"
          cancelText="Cancelar"
          open={!!deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AsignacionesPage;
