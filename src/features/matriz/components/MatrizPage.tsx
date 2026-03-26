import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Checkbox,
  Row,
  Col,
  Statistic,
  Space,
  Spin,
  Empty,
  message,
} from "antd";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/shared/components/molecules/PageHeader";
import { Can } from "@/shared/components/atoms/Can";
import { useMatriz } from "../hooks/useMatriz";
import { MatrizFiltersComponent } from "./MatrizFilters";
import { MatrizConfirmModal } from "./MatrizConfirmModal";

export const MatrizPage = () => {
  const matriz = useMatriz();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    matriz.fetchMatriz();
  }, []);

  if (!matriz.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const { roles, permisos } = matriz.data;

  // Columnas de la tabla
  const columns = [
    {
      title: "ROLES",
      key: "rolName",
      width: 250,
      fixed: "left" as const,
      render: (_: any, record: any) => (
        <div className="font-semibold text-sm">
          <div>{record.rolName}</div>
          <div className="text-xs text-gray-500">
            {record.userCount} Usuarios
          </div>
        </div>
      ),
    },
    ...permisos.map((permiso) => ({
      key: `permiso-${permiso.id}`,
      title: (
        <div className="text-xs font-semibold text-center">
          <div>{permiso.name}</div>
          <div className="text-gray-600">{permiso.accion}</div>
        </div>
      ),
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => {
        const isAsignado = matriz.isPermisoAsignado(
          record.rolId,
          permiso.id,
          record.permisos,
        );
        return (
          <Checkbox
            checked={isAsignado}
            onChange={() =>
              matriz.togglePermiso(record.rolId, permiso.id, isAsignado)
            }
          />
        );
      },
    })),
  ];

  const tableData = roles.map((rol) => ({
    key: rol.id,
    rolId: rol.id,
    rolName: rol.name,
    userCount: rol.userCount,
    permisos: rol.permisos,
  }));

  const handleSaveClick = () => {
    if (matriz.changes.size === 0) {
      message.warning("No hay cambios para guardar");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    await matriz.saveChanges();
    setConfirmOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Matriz Roles - Permiso"
        breadcrumbs={[
          { label: "Seguridad y Accesos" },
          { label: "Matriz Rol-Permiso" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Descripción */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-gray-700">
            Asigna permisos a roles de forma masiva. Los cambios no se aplican
            hasta guardar.
          </p>
        </div>

        {/* Estadísticas */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Total Módulos"
              value={matriz.modulos.length}
              suffix="módulos"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Total Roles"
              value={roles.length}
              suffix="roles"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Cambios Realizados"
              value={matriz.changes.size}
              valueStyle={{
                color: matriz.changes.size > 0 ? "#ff7a45" : "#1890ff",
              }}
            />
          </Col>
        </Row>

        {/* Filtros */}
        <MatrizFiltersComponent
          filters={matriz.filters}
          setFilters={matriz.setFilters}
          modulos={matriz.modulos}
          roles={roles}
        />

        {/* Tabla */}
        <div className="bg-white rounded border overflow-hidden">
          <Spin spinning={matriz.loading}>
            {permisos.length === 0 ? (
              <Empty description="No hay permisos disponibles" />
            ) : (
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 1200 }}
                size="small"
                bordered
              />
            )}
          </Spin>
        </div>

        {/* Botones de acción */}
        <Row justify="space-between" align="middle">
          <Col>
            {matriz.changes.size > 0 && (
              <Can permission="roles.editar">
                <Space>
                  <Button
                    type="primary"
                    icon={<Save size={16} />}
                    loading={matriz.submitting}
                    onClick={handleSaveClick}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    icon={<X size={16} />}
                    onClick={matriz.cancelChanges}
                    disabled={matriz.submitting}
                  >
                    Cancelar
                  </Button>
                </Space>
              </Can>
            )}
          </Col>
          <Col>
            <span className="text-gray-600">
              {matriz.changes.size > 0
                ? `${matriz.changes.size} cambios pendientes`
                : "Sin cambios"}
            </span>
          </Col>
        </Row>
      </div>

      {/* Modal de confirmación */}
      <MatrizConfirmModal
        open={confirmOpen}
        changesCount={matriz.changes.size}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
        loading={matriz.submitting}
      />
    </div>
  );
};
