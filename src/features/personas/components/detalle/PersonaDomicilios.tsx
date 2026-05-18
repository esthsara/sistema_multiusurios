// src/features/personas/components/detalle/PersonaDomicilios.tsx
import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { ConfirmModal } from "@/shared/components/organisms/ConfirmModal";
import { Can } from "@/shared/components/guards/Can";
import { useDomicilios } from "../../hooks/useDomicilios";
import type { Domicilio } from "./Domicilio/domicilio.constants";

import { DomicilioTable } from "./Domicilio/DomicilioTable";
import { DomicilioFormModal } from "./Domicilio/DomicilioFormModal";
import { DomicilioViewModal } from "./Domicilio/DomicilioViewModal";

interface PersonaDomiciliosProps {
  personaId: number;
}

export const PersonaDomicilios = ({ personaId }: PersonaDomiciliosProps) => {
  const {
    domicilios,
    loading,
    modal,
    markingPrincipalId,
    handleSubmit,
    handleDelete,
    handleMarkPrincipal,
  } = useDomicilios(personaId);

  const [viewItem, setViewItem] = useState<Domicilio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Domicilio | null>(null);
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
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">Domicilios</h3>
        <Can permission="personas.crear">
          <Button icon={<Plus size={14} />} onClick={modal.openCreate}>
            Nuevo
          </Button>
        </Can>
      </div>

      <DomicilioTable
        data={domicilios}
        loading={loading}
        markingPrincipalId={markingPrincipalId}
        onMarkPrincipal={handleMarkPrincipal}
        onView={setViewItem}
        onEdit={modal.openEdit}
        onDelete={setDeleteTarget}
      />

      <DomicilioFormModal
        open={modal.isOpen}
        isEdit={modal.isEditMode}
        loading={modal.isSubmitting}
        item={modal.selectedItem}
        onSubmit={handleSubmit}
        onCancel={modal.close}
      />

      <DomicilioViewModal
        open={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar domicilio"
        description="Esta acción es permanente"
        confirmText="Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
