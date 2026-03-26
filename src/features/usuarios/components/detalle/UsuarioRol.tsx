// src/features/usuarios/components/detalle/UsuarioRol.tsx
import { useState, useEffect, useCallback } from "react";
import { Button, Modal, Select, Tag, Card } from "antd";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Can } from "@/shared/components/atoms/Can";
import { rolesService } from "@/features/roles/services/roles.service";
import type { UsuarioDetalle } from "../../types/usuario.types";
import type { RolListItem } from "@/features/roles/types/rol.types";

interface UsuarioRolProps {
  usuario: UsuarioDetalle;
  onCambiarRol: (rolId: number) => void;
}

/**
 * Permisos que consideramos "concedidos" vs "restricciones"
 * basados en la nomenclatura del backend.
 * Los que terminan en .ver, .crear, .editar → concedidos
 * Los que implican acciones destructivas → restricciones
 */
const ACCIONES_CRITICAS = ["eliminar", "eliminar_permanente", "exportar"];

const formatPermiso = (permiso: string) => {
  const [modulo = "general", accion = "acceso"] = permiso.split(".");
  return {
    modulo: modulo.replaceAll("_", " "),
    accion: accion.replaceAll("_", " "),
  };
};

export const UsuarioRol = ({ usuario, onCambiarRol }: UsuarioRolProps) => {
  const [roles, setRoles] = useState<RolListItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await rolesService.getAll();
      setRoles(res.data.items);
    } catch {
      toast.error("Error al cargar roles");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCambiarRol = async () => {
    if (!rolSeleccionado) return;
    setLoading(true);
    try {
      onCambiarRol(rolSeleccionado);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  /* Clasifica permisos en concedidos vs restricciones */
  const permisosNormales = usuario.permisos.filter(
    (p) => !ACCIONES_CRITICAS.some((a) => p.endsWith(`.${a}`)),
  );
  const permisosRestringidos = usuario.permisos.filter((p) =>
    ACCIONES_CRITICAS.some((a) => p.endsWith(`.${a}`)),
  );

  return (
    <div>
      {/* Header con botón cambiar rol */}
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Rol asignado
        </h3>
        <Can permission="roles.editar">
          <Button
            type="primary"
            size="middle"
            className="rounded-lg"
            style={{ fontWeight: 600 }}
            onClick={() => setModalOpen(true)}
          >
            Cambiar Rol
          </Button>
        </Can>
      </div>

      <Card
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "0 6px 20px rgba(2, 6, 23, 0.04)",
        }}
      >
        {/* Rol actual */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="text-xs font-semibold m-0 mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              PERMISOS SEGÚN ROL
            </p>
            <div className="flex gap-2 flex-wrap">
              {usuario.roles.map((rol) => (
                <Tag key={rol} color="blue" className="text-sm">
                  {rol}
                </Tag>
              ))}
              {usuario.roles.length === 0 && (
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Sin rol asignado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Permisos concedidos vs restricciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Permisos Concedidos */}
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2
                size={16}
                style={{ color: "var(--color-success-500)" }}
              />
              <p
                className="text-sm font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Permisos Concedidos
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {permisosNormales.map((permiso) => (
                <span
                  key={permiso}
                  className="text-xs px-2.5 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-bg-base)",
                    color: "var(--color-text-primary)",
                    border: "1px solid rgba(34,197,94,0.28)",
                  }}
                >
                  <strong
                    className="uppercase"
                    style={{ color: "var(--color-success-600)" }}
                  >
                    {formatPermiso(permiso).modulo}
                  </strong>{" "}
                  ·{" "}
                  <span className="capitalize">
                    {formatPermiso(permiso).accion}
                  </span>
                </span>
              ))}
              {permisosNormales.length === 0 && (
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Sin permisos concedidos
                </p>
              )}
            </div>
          </div>

          {/* Restricciones */}
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={16} style={{ color: "var(--color-danger-500)" }} />
              <p
                className="text-sm font-semibold m-0"
                style={{ color: "var(--color-text-primary)" }}
              >
                Acciones de Alto Impacto
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {permisosRestringidos.map((permiso) => (
                <span
                  key={permiso}
                  className="text-xs px-2.5 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-bg-base)",
                    color: "var(--color-text-primary)",
                    border: "1px solid rgba(239,68,68,0.28)",
                  }}
                >
                  <strong
                    className="uppercase"
                    style={{ color: "var(--color-danger-500)" }}
                  >
                    {formatPermiso(permiso).modulo}
                  </strong>{" "}
                  ·{" "}
                  <span className="capitalize">
                    {formatPermiso(permiso).accion}
                  </span>
                </span>
              ))}
              {permisosRestringidos.length === 0 && (
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Sin permisos de alto impacto
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal cambiar rol */}
      <Modal
        open={modalOpen}
        title="Cambiar Rol del Usuario"
        onOk={handleCambiarRol}
        onCancel={() => setModalOpen(false)}
        okText="Cambiar Rol"
        cancelText="Cancelar"
        okButtonProps={{ loading, disabled: !rolSeleccionado }}
        width={400}
      >
        <div className="my-4">
          <p
            className="text-sm mb-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Rol actual:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {usuario.roles[0] ?? "Sin rol"}
            </strong>
          </p>
          <Select
            placeholder="Seleccionar nuevo rol"
            className="w-full"
            value={rolSeleccionado ?? undefined}
            onChange={setRolSeleccionado}
            options={roles.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
          />
        </div>
      </Modal>
    </div>
  );
};
