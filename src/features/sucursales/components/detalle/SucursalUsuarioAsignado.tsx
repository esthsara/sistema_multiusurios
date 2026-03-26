import { useState } from "react";
import { Button, Modal, Popconfirm, Table, Tag, Select, Form } from "antd";
import type { TableColumnsType } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type {
  SucursalDetalle,
  SucursalUsuario,
} from "../../types/sucursal.types";
import { asignacionesService } from "../../services/asignaciones.service";
import { usuariosService } from "@/features/usuarios/services/usuarios.service";
import type { UsuarioListItem } from "@/features/usuarios/types/usuario.types";

interface SucursalUsuarioAsignadoProps {
  sucursal: SucursalDetalle;
  onQuitarUsuario: (usuarioId: number) => Promise<void>;
}

export const SucursalUsuarioAsignado = ({
  sucursal,
  onQuitarUsuario,
}: SucursalUsuarioAsignadoProps) => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<
    UsuarioListItem[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState<SucursalUsuario[]>(
    sucursal.usuarios,
  );

  const handleOpenAssignModal = async () => {
    setLoadingUsers(true);
    try {
      const res = await usuariosService.getAll({});
      // Filtrar usuarios que ya están asignados
      const asignados = usuarios.map((u) => u.id);
      const disponibles = (res.data ?? []).filter(
        (u: UsuarioListItem) => !asignados.includes(u.id),
      );
      setUsuariosDisponibles(disponibles);
      setAssignModalOpen(true);
    } catch {
      toast.error("Error al cargar usuarios disponibles");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssignUser = async () => {
    try {
      const values = await form.validateFields();
      setAssigningLoading(true);

      await asignacionesService.asignar({
        usuario_id: values.usuario_id,
        sucursal_id: sucursal.id,
      });

      toast.success("Usuario asignado correctamente");

      // Agregar usuario a la lista
      const nuevoUsuario = usuariosDisponibles.find(
        (u) => u.id === values.usuario_id,
      );
      if (nuevoUsuario) {
        setUsuarios([
          ...usuarios,
          {
            id: nuevoUsuario.id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            activo: nuevoUsuario.activo,
            ultimo_acceso: "",
            created_at: new Date().toISOString(),
            created_at_humano: "Ahora",
          },
        ]);
      }

      setAssignModalOpen(false);
      form.resetFields();
    } catch {
      toast.error("Error al asignar usuario");
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleQuitar = async (usuarioId: number) => {
    try {
      await onQuitarUsuario(usuarioId);
      setUsuarios(usuarios.filter((u) => u.id !== usuarioId));
    } catch {
      // Error ya manejado en onQuitarUsuario
    }
  };

  const columns: TableColumnsType<SucursalUsuario> = [
    {
      title: "Usuario",
      key: "usuario",
      render: (_, r) => (
        <div>
          <p
            className="m-0 font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            @{r.username}
          </p>
          <p
            className="m-0 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {r.email}
          </p>
        </div>
      ),
    },
    {
      title: "Estado",
      key: "activo",
      width: 130,
      render: (_, r) => (
        <Tag color={r.activo ? "green" : "red"}>
          {r.activo ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Último acceso",
      dataIndex: "ultimo_acceso",
      key: "ultimo_acceso",
      width: 180,
      render: (v: string) => v || "—",
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 100,
      render: (_, r) => (
        <Popconfirm
          title="Quitar usuario"
          description="¿Deseas quitar este usuario de la sucursal?"
          okText="Quitar"
          cancelText="Cancelar"
          onConfirm={() => handleQuitar(r.id)}
        >
          <Button danger type="text" icon={<Trash2 size={14} />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Usuarios Asignados
        </h3>
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={handleOpenAssignModal}
        >
          Asignar Usuario
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={usuarios}
        columns={columns}
        pagination={false}
        size="small"
        style={{
          backgroundColor: "var(--color-bg-base)",
          borderRadius: "var(--radius-card)",
        }}
      />

      <Modal
        open={assignModalOpen}
        title="Asignar Usuario a Sucursal"
        onCancel={() => {
          setAssignModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAssignUser}
        okText="Asignar"
        cancelText="Cancelar"
        okButtonProps={{ loading: assigningLoading }}
        width={420}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="usuario_id"
            label="Seleccionar Usuario"
            rules={[{ required: true, message: "Selecciona un usuario" }]}
          >
            <Select
              loading={loadingUsers}
              placeholder="Buscar usuario..."
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) || false
              }
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
