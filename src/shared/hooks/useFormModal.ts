// src/shared/hooks/useFormModal.ts
import { useState, useCallback } from "react";

/**
 * ModalMode — Los dos modos posibles de un modal de formulario.
 */
type ModalMode = "create" | "edit";

/**
 * useFormModal<T> — Maneja estado de un modal crear/editar.
 *
 * Generic <T> → el tipo del ítem que se edita.
 * Cuando se abre en modo 'create', selectedItem es null.
 * Cuando se abre en modo 'edit', selectedItem es T.
 *
 * Uso:
 *   const modal = useFormModal<Persona>()
 *   modal.openCreate()          → abre en modo crear
 *   modal.openEdit(persona)     → abre en modo editar con datos
 *   modal.close()               → cierra y limpia
 */
export const useFormModal = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = useCallback(() => {
    setSelectedItem(null);
    setMode("create");
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setMode("edit");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay para no limpiar el ítem mientras el modal
    // aún está animando el cierre
    setTimeout(() => {
      setSelectedItem(null);
      setMode("create");
    }, 300);
  }, []);

  return {
    isOpen,
    mode,
    selectedItem,
    isSubmitting,
    setIsSubmitting,
    isEditMode: mode === "edit",
    isCreateMode: mode === "create",
    openCreate,
    openEdit,
    close,
  };
};
