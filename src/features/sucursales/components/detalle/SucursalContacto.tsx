import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { Can } from "@/shared/components/guards/Can";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";

import { useSucursalContactos } from "../../hooks/useSucursalContactos";
import type { SucursalContacto as SucursalContactoItem } from "../../types/sucursal.types";

import { ContactoFormModal } from "./contacto/ContactoFormModal";
import { ContactoViewModal } from "./contacto/ContactoViewModal";
import { getContactoTable } from "./contacto/ContactoTable";

interface SucursalContactoProps {
  sucursalId: number;
}

export const SucursalContacto = ({ sucursalId }: SucursalContactoProps) => {
  const { contactos, loading, modal, handleSubmit, handleDelete } =
    useSucursalContactos(sucursalId);

  const [selected, setSelected] = useState<SucursalContactoItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SucursalContactoItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const columns = getContactoTable({
    data: contactos,
    loading,
    onView: (item) => {
      setSelected(item);
      setViewOpen(true);
    },
    onEdit: (item) => {
      modal.openEdit(item);
      setSelected(item);
    },
    onDelete: setDeleteTarget,
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.id);
      if (selected?.id === deleteTarget.id) {
        setSelected(null);
        setViewOpen(false);
      }
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">Contactos de Sucursal</h3>

        <Can permission="contactos.crear">
          <Button icon={<Plus size={14} />} onClick={modal.openCreate}>
            Nuevo
          </Button>
        </Can>
      </div>

      {columns}

      <ContactoFormModal
        open={modal.isOpen}
        isEdit={modal.isEditMode}
        loading={modal.isSubmitting}
        item={modal.selectedItem}
        onSubmit={handleSubmit}
        onCancel={modal.close}
      />

      <ContactoViewModal
        open={viewOpen}
        item={selected}
        onClose={() => setViewOpen(false)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar contacto"
        description="Esta acción es permanente"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
};
