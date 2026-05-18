import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { Can } from "@/shared/components/guards/Can";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { useContactos } from "../../hooks/useContactos";
import type { Contacto } from "../../components/detalle/Contacto/contacto.constants";

import { ContactoTable } from "./Contacto/ContactoTable";
import { ContactoFormModal } from "./Contacto/ContactoFormModal";
import { ContactoViewModal } from "./Contacto/ContactoViewModal";

interface PersonaContactosProps {
  personaId: number;
}

export const PersonaContactos = ({ personaId }: PersonaContactosProps) => {
  const { contactos, loading, modal, handleSubmit, handleDelete } =
    useContactos(personaId);

  const [viewItem, setViewItem] = useState<Contacto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contacto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await handleDelete(deleteTarget.id);

      if (viewItem?.id === deleteTarget.id) {
        setViewItem(null);
      }
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">Contactos</h3>

        <Can permission="personas.crear">
          <Button icon={<Plus size={14} />} onClick={modal.openCreate}>
            Nuevo
          </Button>
        </Can>
      </div>

      {/* TABLA */}
      <ContactoTable
        data={contactos}
        loading={loading}
        onView={setViewItem}
        onEdit={modal.openEdit}
        onDelete={setDeleteTarget}
      />

      {/* MODALES */}
      <ContactoFormModal
        open={modal.isOpen}
        isEdit={modal.isEditMode}
        loading={modal.isSubmitting}
        item={modal.selectedItem}
        onSubmit={handleSubmit}
        onCancel={modal.close}
      />

      <ContactoViewModal
        open={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Eliminar contacto"
        description="Esta acción es permanente"
        confirmText="Eliminar"
        loading={deleting}
      />
    </div>
  );
};
