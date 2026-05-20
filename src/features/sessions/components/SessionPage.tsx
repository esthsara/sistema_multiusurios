import { useMemo, useState } from "react";
import { Card, Empty, Pagination } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { Monitor, Smartphone, Cpu, Box, Globe } from "lucide-react";
import { DataTable } from "@/shared/components/organisms/DataTable";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { SessionFilters } from "./SessionFilters";
import { SessionConfirmModal } from "./SessionConfirmModal";
import { useSessions } from "../hooks/useSessions";
import type { SessionItem } from "../types/sessions.types";
import { AppTag } from "@/shared/components/atoms/AppTag";

const deviceIcon = (device: string) => {
  const d = (device || "").toLowerCase();
  if (d.includes("win")) return <Monitor size={18} />;
  if (d.includes("mac")) return <Cpu size={18} />;
  if (d.includes("linux")) return <Box size={18} />;
  if (d.includes("postman")) return <Globe size={18} />;
  if (d.includes("mobile") || d.includes("android") || d.includes("iphone"))
    return <Smartphone size={18} />;
  return <Monitor size={18} />;
};

const SessionCard = ({ session }: { session: SessionItem }) => (
  <Card
    className="shadow-sm border-[var(--color-border)]" 
    styles={{
      body: { padding: "16px" },
    }}
  >
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-blue-700">
        {deviceIcon(session.dispositivo)}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div
              className="font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {session.currentToken?.tokenable?.username ??
                session.currentToken?.tokenable?.email ??
                "Usuario"}
            </div>
            <div className="text-xs text-gray-500">{session.dispositivo}</div>
          </div>

          <div className="text-right">
            <div className="text-sm">
              {dayjs(session.login_at).format("DD/MM/YYYY HH:mm")}
            </div>
            <div className="text-xs text-gray-500">
              {session.ultima_actividad}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {session.es_actual && <AppTag tone="primary">Sesión actual</AppTag>}
          {session.activa ? (
            <AppTag tone="success">Activa</AppTag>
          ) : (
            <AppTag tone="neutral">Inactiva</AppTag>
          )}
          <div className="text-xs text-gray-500">{session.ip ?? "—"}</div>
        </div>

        {session.currentToken && (
          <div className="mt-3 text-xs text-gray-600" style={{ fontSize: 13 }}>
            <strong>Token:</strong> {session.currentToken.name} •{" "}
            <strong>Último uso:</strong>{" "}
            {session.currentToken.last_used_at
              ? dayjs(session.currentToken.last_used_at).format(
                  "DD/MM/YYYY HH:mm",
                )
              : "—"}
          </div>
        )}
      </div>
    </div>
  </Card>
);

const SessionsPage = () => {
 
  const sessions = useSessions();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: TableColumnsType<SessionItem> = useMemo(
    () => [
      {
        title: "Usuario",
        key: "user",
        width: 280,
        render: (_, item) => (
          <div>
            <div className="font-medium">
              {item.currentToken?.tokenable?.username ?? "Usuario"}
            </div>
            <div className="text-xs text-gray-500">
              {item.currentToken?.tokenable?.email ?? "—"}
            </div>
          </div>
        ),
      },
      {
        title: "Dispositivo",
        dataIndex: "dispositivo",
        key: "dispositivo",
        width: 160,
        render: (d: string) => (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{deviceIcon(d)}</span>
            <span>{d}</span>
          </div>
        ),
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
        width: 140,
      },
      {
        title: "Inicio de sesión",
        dataIndex: "login_at",
        key: "login_at",
        width: 180,
        render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Última actividad",
        dataIndex: "ultima_actividad",
        key: "ultima_actividad",
        width: 160,
      },
      {
        title: "Estado",
        key: "estado",
        width: 160,
        render: (_, r) => (
          <div className="flex items-center gap-2">
            {r.es_actual && <AppTag tone="primary">Sesión actual</AppTag>}
            {r.activa ? (
              <AppTag tone="success">Activa</AppTag>
            ) : (
              <AppTag tone="neutral">Inactiva</AppTag>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const paginated = useMemo(() => {
    const start =
      (sessions.table.state.page - 1) * sessions.table.state.pageSize;
    return sessions.filtered.slice(
      start,
      start + sessions.table.state.pageSize,
    );
  }, [
    sessions.filtered,
    sessions.table.state.page,
    sessions.table.state.pageSize,
  ]);

  return (
    <div className="p-6">
      <PageHeader
        title="Sesiones"
        description="Visualiza y administra las sesiones activas en el sistema"
        breadcrumbs={[{ label: "Seguridad y Accesos" }, { label: "Sesiones" }]}
      />

      <SessionFilters
        search={sessions.table.state.search as string}
        filters={sessions.table.state.filters}
        loading={sessions.loading}
        onSearchChange={sessions.table.setSearch}
        onFiltersChange={sessions.table.setFilters}
        onReset={sessions.table.reset}
        onRevokeAll={() => setConfirmOpen(true)}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
      />

      {viewMode === "table" ? (
        <DataTable<SessionItem>
          rowKey="id"
          columns={columns}
          data={paginated}
          loading={sessions.loading}
          emptyText="No hay sesiones registradas"
          scrollX={900}
          pagination={{
            current: sessions.table.state.page,
            pageSize: sessions.table.state.pageSize,
            total: sessions.total,
            onChange: sessions.table.setPage,
          }}
        />
      ) : (
        <div>
          {sessions.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse"
                  style={{ height: 120 }}
                />
              ))}
            </div>
          ) : sessions.filtered.length === 0 ? (
            <Empty description="No hay sesiones activas" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.filtered.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Pagination
              current={sessions.table.state.page}
              pageSize={sessions.table.state.pageSize}
              total={sessions.total}
              showSizeChanger
              onChange={sessions.table.setPage}
              onShowSizeChange={sessions.table.setPage}
            />
          </div>
        </div>
      )}

      <SessionConfirmModal
        open={confirmOpen}
        loading={sessions.revoking}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          const ok = await sessions.revokeAll();
          if (ok) setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default SessionsPage;
