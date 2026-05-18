import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, Form, Select } from "antd";
import type { TableColumnsType } from "antd";
import { Plus, Eye , UserMinus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Can } from "@/shared/components/guards/Can";
import { useAuthStore } from "@/features/auth/store/auth.store";

import { DataTableSimple } from "@/shared/components/organisms/DataTableSimple";
import { RowActions } from "@/shared/components/molecules/RowActions";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

import { useAsignaciones } from "@/features/asignaciones/hooks/useAsignaciones";
import { sucursalesService } from "@/features/sucursales/services/sucursales.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import type { UsuarioListItem } from "@/features/usuarios/types/usuario.types";
import type {
  SucursalDetalle,
  SucursalUsuario,
} from "@/features/sucursales/types/sucursal.types";

interface Props {
  sucursal: SucursalDetalle;
}

export const SucursalUsuarioAsignado = ({ sucursal }: Props) => {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canAsignar = hasPermission("asignaciones.asignar");
  const canQuitar = hasPermission("asignaciones.quitar");

  const { asignar, quitar } = useAsignaciones();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<
    UsuarioListItem[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [form] = Form.useForm<{ usuario_id: number }>();
  const [usuarios, setUsuarios] = useState<SucursalUsuario[]>(
    sucursal.usuarios,
  );

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FETCH — usuarios asignados a esta sucursal
     Se obtienen desde GET /sucursales/{id} (campo usuarios[])
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const fetchUsuariosAsignados = useCallback(async () => {
    try {
      const res = await sucursalesService.getById(sucursal.id);
      const items = Array.isArray(res.data.usuarios) ? res.data.usuarios : [];
      setUsuarios(items as SucursalUsuario[]);
    } catch {
      // Fallback: usar los que ya vienen en el detalle de sucursal
      setUsuarios(sucursal.usuarios);
    }
  }, [sucursal.id, sucursal.usuarios]);

  useEffect(() => {
    fetchUsuariosAsignados();
  }, [fetchUsuariosAsignados]);

  const usuariosAsignadosIds = useMemo(
    () => new Set(usuarios.map((u) => u.id)),
    [usuarios],
  );

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ABRIR MODAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const handleOpenAssignModal = async () => {
    setLoadingUsers(true);
    try {
      const res = await usuariosService.getAll({ per_page: 200 });
      const disponibles = (res.data ?? []).filter(
        (u: UsuarioListItem) => !usuariosAsignadosIds.has(u.id),
      );
      setUsuariosDisponibles(disponibles);
      setAssignModalOpen(true);
    } catch {
      toast.error("Error al cargar usuarios disponibles");
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ASIGNAR
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const handleAssignUser = async () => {
    try {
      const values = await form.validateFields();
      setAssigningLoading(true);

      // ✅ Llama al método correcto del hook centralizado
      const ok = await asignar(values.usuario_id, sucursal.id);
      if (!ok) return;

      await fetchUsuariosAsignados();
      setAssignModalOpen(false);
      form.resetFields();
    } finally {
      setAssigningLoading(false);
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     QUITAR
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const handleQuitar = async (usuarioId: number) => {
    // ✅ Llama al método correcto del hook centralizado
    const ok = await quitar(sucursal.id, usuarioId);
    if (!ok) return;
    await fetchUsuariosAsignados();
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     COLUMNAS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  const columns: TableColumnsType<SucursalUsuario> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, r) => (
        <div>
          <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
            @{r.username}
          </p>
          <p className="m-0 text-xs text-[var(--color-text-secondary)]">
            {r.email}
          </p>
        </div>
      ),
    },
    {
      title: "Estado",
      key: "activo",
      width: 120,
      render: (_, r) => (
        <AppTag tone={r.activo ? "success" : "danger"}>
          {r.activo ? "Activo" : "Inactivo"}
        </AppTag>
      ),
    },
    {
      title: "Último acceso",
      dataIndex: "ultimo_acceso",
      width: 160,
      render: (v: string) => v || "—",
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <RowActions
          actions={[
            {
              key: "view",
              label: "Ver usuario",
              icon: <Eye size={14} />,
              onClick: () =>
                navigate(APP_ROUTES.DASHBOARD.USUARIOS.DETALLE(record.id)),
            },
            ...(canQuitar
              ? [
                  {
                    key: "remove",
                    label: "Desvincular",
                    icon: <UserMinus size={14} />,
                    danger: true,
                    onClick: () => handleQuitar(record.id),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     RENDER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold m-0 text-[var(--color-text-primary)]">
          Usuarios Asignados
        </h3>
        <Can permission="asignaciones.asignar">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            loading={loadingUsers}
            onClick={handleOpenAssignModal}
          >
            Asignar Usuario
          </Button>
        </Can>
      </div>

      <DataTableSimple
        rowKey="id"
        dataSource={usuarios}
        columns={columns}
        loading={false}
      />

      <Modal
        open={assignModalOpen}
        title="Asignar Usuario"
        onCancel={() => {
          setAssignModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAssignUser}
        okText="Asignar"
        cancelText="Cancelar"
        okButtonProps={{ loading: assigningLoading }}
        width={600}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" size="large" className="mt-4">
          <Form.Item
            name="usuario_id"
            label="Seleccionar Usuario"
            rules={[{ required: true, message: "Selecciona un usuario" }]}
          >
            <Select
              loading={loadingUsers}
              placeholder="Buscar usuario..."
              showSearch
              optionFilterProp="label"
              options={usuariosDisponibles.map((u) => ({
                value: u.id,
                label: `${u.username} (${u.email})`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
