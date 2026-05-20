import { useMemo } from "react";
import { Card, Col, Empty, Pagination, Row, Statistic } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { AuditoriaFiltersPanel } from "./AuditoriaFilters";
import { AuditoriaDetailModal } from "./AuditoriaDetailModal";
import { useAuditoria } from "../hooks/useAuditoria";
import type { AuditoriaListItem } from "../types/auditoria.types";

const actionTone = (accion: string) => {
  if (accion.includes("CREADO") || accion.includes("LOGIN")) return "success";
  if (accion.includes("ACTUALIZADO") || accion.includes("SINCRONIZADOS")) {
    return "primary";
  }
  if (
    accion.includes("ELIMINADO") ||
    accion.includes("DESACTIVADO") ||
    accion.includes("LOGOUT")
  ) {
    return "danger";
  }
  return "neutral";
};

const normalizeGroupLabel = (dateKey: string) => {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  if (dateKey === today) return "HOY";
  if (dateKey === yesterday) return "AYER";
  return dayjs(dateKey).format("DD/MM/YYYY");
};

const AuditoriaPage = () => {
  const auditoria = useAuditoria();

  const activeFiltersCount = useMemo(() => {
    return Object.values(auditoria.table.state.filters).filter((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    }).length;
  }, [auditoria.table.state.filters]);

  const columns: TableColumnsType<AuditoriaListItem> = useMemo(
    () => [
      {
        title: "Usuario",
        key: "usuario",
        width: 280,
        render: (_, item) => (
          <div>
            <div className="font-medium">{item.usuario.nombre}</div>
            <div className="text-xs text-gray-500">{item.usuario.email}</div>
          </div>
        ),
      },
      {
        title: "Acción",
        dataIndex: "accion",
        key: "accion",
        width: 180,
        render: (accion: string, item) => (
          <AppTag tone={actionTone(accion)}>{item.accion_texto || accion}</AppTag>
        ),
      },
      {
        title: "Entidad",
        dataIndex: "entidad_nombre",
        key: "entidad_nombre",
        width: 140,
      },
      {
        title: "ID",
        dataIndex: "entidad_id",
        key: "entidad_id",
        width: 90,
      },
      {
        title: "Fecha",
        key: "fecha",
        width: 220,
        render: (_, item) => (
          <div>
            <div>{item.fecha}</div>
            <div className="text-xs text-gray-500">
              {item.created_at_humano}
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-6">

      <PageHeader
        title="Auditoría"
        description="Registro completo de todas las acciones realizadas en el sistema"
        breadcrumbs={[{ label: "Seguridad y Accesos" }, { label: "Auditoría" }]}
      />

      <Row gutter={[12, 12]} className="mb-4">
        <Col xs={12} sm={8} md={6}>
          <div
            className="p-3 rounded-lg"
            style={{
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Statistic
              title="Actividades"
              value={auditoria.total}
              styles={{
                content: {
                  color: "var(--color-primary-600)"
                }
              }}
            />
          </div>
        </Col>

        <Col xs={12} sm={8} md={6}>
          <div
            className="p-3 rounded-lg"
            style={{
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Statistic title="Filtros activos" value={activeFiltersCount} />
          </div>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <div
            className="p-3 rounded-lg"
            style={{
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Statistic title="Total páginas" value={auditoria.lastPage} />
          </div>
        </Col>
      </Row>

      <AuditoriaFiltersPanel
        search={auditoria.table.state.search}
        filters={auditoria.table.state.filters}
        acciones={auditoria.acciones}
        entidades={auditoria.entidades}
        usuarios={auditoria.usuarios}
        viewMode={auditoria.viewMode}
        loading={auditoria.loading}
        exporting={auditoria.exporting}
        onSearchChange={auditoria.table.setSearch}
        onFiltersChange={auditoria.table.setFilters}
        onViewModeChange={auditoria.setViewMode}
        onReset={auditoria.table.reset}
        onExport={auditoria.exportar}
      />

      {auditoria.viewMode === "table" ? (
        <DataTable<AuditoriaListItem>
          rowKey="id"
          columns={columns}
          data={auditoria.data}
          loading={auditoria.loading}
          emptyText="No hay actividad de auditoría"
          scrollX={1100}
          onRowClick={(row) => auditoria.openDetail(row.id)}
          pagination={{
            current: auditoria.table.state.page,
            pageSize: auditoria.table.state.pageSize,
            total: auditoria.total,
            onChange: auditoria.table.setPage,
          }}
        />
      ) : (
        <Card>
          {auditoria.timelineGroups.length === 0 && !auditoria.loading ? (
            <Empty description="No hay actividad de auditoría" />
          ) : (
            <div className="space-y-5">
              {auditoria.timelineGroups.map((group) => (
                <div key={group.date}>
                  <div
                    className="flex items-center justify-between mb-2 border-b pb-2"
                    style={{ borderBottomColor: "var(--color-border)" }}
                  >
                    <h3 className="m-0 text-sm font-semibold text-gray-600">
                      {normalizeGroupLabel(group.date)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {group.items.length} actividades
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50 transition"
                        style={{ borderColor: "var(--color-border)" }}
                        onClick={() => auditoria.openDetail(item.id)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-semibold">
                              {item.usuario.nombre?.slice(0, 1).toUpperCase() ||
                                "U"}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {item.usuario.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.usuario.email}
                              </div>
                            </div>

                            <AppTag tone={actionTone(item.accion)}>
                              {item.accion_texto || item.accion}
                            </AppTag>
                            <AppTag tone="neutral">{item.entidad_nombre}</AppTag>
                          </div>

                          <div className="text-xs text-gray-500 text-right">
                            <div>{item.fecha}</div>
                            <div>{item.created_at_humano}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Pagination
              current={auditoria.table.state.page}
              pageSize={auditoria.table.state.pageSize}
              total={auditoria.total}
              showSizeChanger
              onChange={auditoria.table.setPage}
              onShowSizeChange={auditoria.table.setPage}
            />
          </div>
        </Card>
      )}

      <AuditoriaDetailModal
        open={auditoria.detailOpen}
        loading={auditoria.detailLoading}
        detail={auditoria.selectedDetail}
        onClose={auditoria.closeDetail}
      />
    </div>
  );
};

export default AuditoriaPage;
