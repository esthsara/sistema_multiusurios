import { Fragment, useMemo, useState } from "react";
import { Button, Checkbox, Input, Spin, Tooltip } from "antd";
import {
  Save,
  RotateCcw,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { Can } from "@/shared/components/guards/Can";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { useMatriz } from "../hooks/useMatriz";
import { MatrizConfirmModal } from "./MatrizConfirmModal";
import type { MatrizPermiso, MatrizRol } from "../types/matriz.types";
import "./Matriz.css";

// ── Colores por módulo usando exclusivamente variables del sistema ──
const MODULO_COLORS: Record<string, string> = {
  personas: "var(--color-primary-600)",
  sucursales: "var(--color-primary-400)",
  usuarios: "var(--color-primary-700)",
  roles: "var(--color-warning-500)",
  permisos: "var(--color-danger-500)",
  reportes: "var(--color-success-500)",
  archivos: "var(--color-text-secondary)",
  auditoria: "var(--color-primary-200)",
  dashboard: "var(--color-primary-400)",
  contactos: "var(--color-danger-500)",
  domicilios: "var(--color-success-500)",
  asignaciones: "var(--color-warning-500)",
};

const getModuloColor = (modulo: string) =>
  MODULO_COLORS[modulo] ?? "var(--color-primary-600)";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const MatrizPage = () => {
  const matriz = useMatriz();
  const roles = matriz.roles as MatrizRol[];
  const permisosAgrupados = matriz.permisosAgrupados as Record<
    string,
    MatrizPermiso[]
  >;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(matriz.modulos),
  );

  const toggleModule = (modulo: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(modulo)) newSet.delete(modulo);
      else newSet.add(modulo);
      return newSet;
    });
  };

  const modulosVisibles = useMemo(() => {
    const termino = search.trim().toLowerCase();
    if (!termino) return matriz.modulos;

    return matriz.modulos.filter((modulo) => {
      const permisos = permisosAgrupados[modulo] ?? [];
      return (
        modulo.toLowerCase().includes(termino) ||
        permisos.some(
          (permiso) =>
            permiso.name.toLowerCase().includes(termino) ||
            permiso.accion.toLowerCase().includes(termino),
        )
      );
    });
  }, [matriz.modulos, permisosAgrupados, search]);

  const resumen = useMemo(() => {
    const totalPermisos = Object.values(permisosAgrupados).flat().length;
    const totalAsignados = roles.reduce((acc, rol) => {
      return acc + rol.permissions.length;
    }, 0);

    return {
      totalModulos: matriz.modulos.length,
      totalPermisos,
      totalRoles: roles.length,
      totalAsignados,
    };
  }, [matriz.modulos.length, permisosAgrupados, roles]);

  if (matriz.loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" description="Cargando matriz de permisos..." />
      </div>
    );
  }

  return (
    <>
      <div className="matriz-page p-6">
        {/* Header */}
        <PageHeader
          title="Matriz de Permisos"
          description="Gestiona permisos por módulo y rol desde una matriz clara, compacta y consistente con el tema del sistema"
          breadcrumbs={[
            { label: "Seguridad y Accesos" },
            { label: "Matriz de Permisos" },
          ]}
          actions={
            <div className="matriz-page__actions">
              {matriz.hayCambios && (
                <AppTag
                  icon={<AlertTriangle size={12} />}
                  tone="warning"
                  className="matriz-changes-tag"
                >
                  {matriz.cambios.length} cambios sin guardar
                </AppTag>
              )}
              <Button
                icon={<RotateCcw size={14} />}
                disabled={!matriz.hayCambios}
                onClick={matriz.descartar}
              >
                Descartar
              </Button>
              <Can permission="permisos.asignar">
                <Button
                  type="primary"
                  icon={<Save size={14} />}
                  disabled={!matriz.hayCambios}
                  loading={matriz.saving}
                  onClick={() => setConfirmOpen(true)}
                >
                  Guardar cambios
                </Button>
              </Can>
            </div>
          }
        />

        <div className="matriz-toolbar">
          <Input
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar acción o permiso..."
            prefix={<Search size={16} />}
            className="matriz-search"
          />

          <div className="matriz-stats">
            <div className="matriz-stat-card">
              <span className="matriz-stat-label">Módulos</span>
              <strong>{resumen.totalModulos}</strong>
            </div>
            <div className="matriz-stat-card">
              <span className="matriz-stat-label">Permisos</span>
              <strong>{resumen.totalPermisos}</strong>
            </div>
            <div className="matriz-stat-card">
              <span className="matriz-stat-label">Roles</span>
              <strong>{resumen.totalRoles}</strong>
            </div>
            <div className="matriz-stat-card">
              <span className="matriz-stat-label">Asignados</span>
              <strong>{resumen.totalAsignados}</strong>
            </div>
          </div>
        </div>

        <div className="matriz-table-wrap">
          <table className="matriz-table">
            <thead>
              <tr>
                <th className="matriz-th matriz-th-sticky">
                  <div className="matriz-header-title">Módulo / Permiso</div>
                  <div className="matriz-header-subtitle">Acciones y filas</div>
                </th>
                {roles.map((rol) => (
                  <th key={rol.id} className="matriz-th matriz-th-role">
                    <div className="matriz-role-title">{rol.name}</div>
                    <div className="matriz-role-progress">
                      <span>
                        {rol.permissions.length}/{resumen.totalPermisos}
                      </span>
                      <span className="matriz-role-progress-bar">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (rol.permissions.length /
                                  Math.max(resumen.totalPermisos, 1)) *
                                  100,
                              ),
                            )}%`,
                          }}
                        />
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modulosVisibles.map((modulo) => {
                const permisos = permisosAgrupados[modulo] ?? [];
                const permisoIds = permisos.map((p) => p.id);
                const moduloColor = getModuloColor(modulo);
                const isExpanded = expandedModules.has(modulo);

                return (
                  <Fragment key={modulo}>
                    <tr className="matriz-module-row">
                      <td className="matriz-module-cell matriz-td-sticky">
                        <div className="matriz-module-main">
                          <button
                            className="matriz-expand-btn"
                            onClick={() => toggleModule(modulo)}
                            aria-label={isExpanded ? "Colapsar" : "Expandir"}
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <span
                            className="matriz-module-dot"
                            style={{ backgroundColor: moduloColor }}
                          />
                          <span className="matriz-module-name">
                            {cap(modulo)}
                          </span>
                          <AppTag
                            tone="neutral"
                            className="matriz-module-count"
                            style={{ padding: "0 6px" }}
                          >
                            {permisos.length}
                          </AppTag>
                        </div>
                        <div className="matriz-module-meta">
                          <span>{permisoIds.length} permisos</span>
                          <span>{roles.length} roles</span>
                        </div>
                      </td>
                      {roles.map((rol) => {
                        const todos = matriz.tieneModuloCompleto(
                          rol.id,
                          permisoIds,
                        );
                        const algunos = permisoIds.some((id) =>
                          matriz.tienePermiso(rol.id, id),
                        );
                        return (
                          <td
                            key={`modulo-${modulo}-rol-${rol.id}`}
                            className="matriz-td"
                          >
                            <Can permission="permisos.asignar">
                              <Tooltip
                                title={
                                  todos
                                    ? `Quitar todos los permisos de ${cap(modulo)}`
                                    : `Dar todos los permisos de ${cap(modulo)}`
                                }
                              >
                                <Checkbox
                                  checked={todos}
                                  indeterminate={!todos && algunos}
                                  onChange={() =>
                                    matriz.toggleModulo(
                                      rol.id,
                                      permisoIds,
                                      todos,
                                    )
                                  }
                                  className="matriz-checkbox"
                                />
                              </Tooltip>
                            </Can>
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded &&
                      permisos.map((permiso) => (
                        <tr
                          key={`permiso-${permiso.id}`}
                          className="matriz-perm-row"
                        >
                          <td className="matriz-perm-name-cell matriz-td-sticky">
                            <span
                              className="matriz-perm-action"
                              style={{
                                backgroundColor: `${moduloColor}18`,
                                color: moduloColor,
                              }}
                            >
                              {permiso.accion}
                            </span>
                            <span className="matriz-perm-name">
                              {permiso.name}
                            </span>
                          </td>
                          {roles.map((rol) => {
                            const activo = matriz.tienePermiso(
                              rol.id,
                              permiso.id,
                            );
                            const origActivo = rol.permissions.some(
                              (p) => p.id === permiso.id,
                            );
                            const cambiado = activo !== origActivo;
                            return (
                              <td
                                key={`p-${permiso.id}-r-${rol.id}`}
                                className={`matriz-td matriz-check-cell ${
                                  cambiado
                                    ? activo
                                      ? "is-added"
                                      : "is-removed"
                                    : ""
                                }`}
                              >
                                <Can permission="permisos.asignar">
                                  <Checkbox
                                    checked={activo}
                                    onChange={() =>
                                      matriz.togglePermiso(rol.id, permiso.id)
                                    }
                                    className="matriz-checkbox"
                                  />
                                </Can>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="matriz-legend">
          <span className="matriz-legend-item">
            <span className="matriz-legend-box matriz-legend-box--add" />
            Permiso recién otorgado (pendiente de guardar)
          </span>
          <span className="matriz-legend-item">
            <span className="matriz-legend-box matriz-legend-box--remove" />
            Permiso recién quitado (pendiente de guardar)
          </span>
        </div>

        <MatrizConfirmModal
          open={confirmOpen}
          changesCount={matriz.cambios.length}
          loading={matriz.saving}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            await matriz.guardar();
            setConfirmOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default MatrizPage;
