// src/features/personas/hooks/usePersonaForm.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { personasService } from "../services/personas.service";
import { useFormModal } from "@/shared/hooks/useFormModal";
import type {
  PersonaListItem,
  PersonaDetalle,
  CreatePersonaDto,
  CreatePersonaFisicaDto,
  CreatePersonaMoralDto,
  UpdatePersonaDto,
} from "../types/persona.types";
import type { TipoPersona } from "@/shared/types/auth.types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILIDADES */

const normalizeText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

type PersonaFormInput = Partial<
  Omit<CreatePersonaFisicaDto, "tipo_persona"> &
    Omit<CreatePersonaMoralDto, "tipo_persona">
>;

const normalizeGenero = (
  value: unknown,
): CreatePersonaFisicaDto["genero"] | undefined => {
  return value === "M" || value === "F" || value === "Otro" ? value : undefined;
};

/**
 * Filtra undefined, null y strings vacíos para evitar enviar datos inválidos.
 * Esto es crucial en edición porque Laravel valida unique:identificacion_principal
 * y si enviamos undefined podría causar errores 422.
 */
const filterEmptyValues = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

/**
 * Construye payload solo con campos FÍSICOS
 * Evita enviar razon_social cuando es FÍSICA
 */
const buildFisicaPayload = (input: PersonaFormInput): UpdatePersonaDto => {
  const payload = {
    nombre: normalizeText(input.nombre),
    apellido: normalizeText(input.apellido),
    identificacion_principal: normalizeText(input.identificacion_principal),
    fecha_nacimiento: normalizeText(input.fecha_nacimiento),
    genero: normalizeGenero(input.genero),
  };
  return filterEmptyValues(payload) as UpdatePersonaDto;
};

/**
 * Construye payload solo con campos MORALES
 * Evita enviar nombre/apellido cuando es MORAL
 */
const buildMoralPayload = (input: PersonaFormInput): UpdatePersonaDto => {
  const payload = {
    razon_social: normalizeText(input.razon_social),
    identificacion_principal: normalizeText(input.identificacion_principal),
  };
  return filterEmptyValues(payload) as UpdatePersonaDto;
};

function buildPersonaPayload(
  raw: CreatePersonaDto | UpdatePersonaDto,
  tipo: TipoPersona,
  isEditMode: true,
): UpdatePersonaDto;
function buildPersonaPayload(
  raw: CreatePersonaDto | UpdatePersonaDto,
  tipo: TipoPersona,
  isEditMode: false,
): CreatePersonaDto;
function buildPersonaPayload(
  raw: CreatePersonaDto | UpdatePersonaDto,
  tipo: TipoPersona,
  isEditMode: boolean,
): CreatePersonaDto | UpdatePersonaDto {
  const input = raw as PersonaFormInput;

  if (tipo === "FISICA") {
    const payload = buildFisicaPayload(input);

    return isEditMode
      ? payload
      : ({ ...payload, tipo_persona: "FISICA" } as CreatePersonaDto);
  }

  const payload = buildMoralPayload(input);

  return isEditMode
    ? payload
    : ({ ...payload, tipo_persona: "MORAL" } as CreatePersonaDto);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOOK */

export const usePersonaForm = (onSuccess: () => void) => {
  const modal = useFormModal<PersonaDetalle>();
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPersona | null>(
    null,
  );
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  const openTypeSelector = () => setTypeSelectorOpen(true);

  const handleTipoSelected = (tipo: TipoPersona) => {
    setTipoSeleccionado(tipo);
    setTypeSelectorOpen(false);
    modal.openCreate();
  };

  const handleEdit = async (persona: PersonaListItem) => {
    // Setear tipo inmediatamente de los datos de lista (no esperar API)
    setTipoSeleccionado(persona.tipo_persona);

    try {
      const response = await personasService.getById(persona.id);
      // modal.openEdit setea selectedItem y abre el modal
      modal.openEdit(response.data);
    } catch (error) {
      toast.error("No se pudo cargar la información de la persona");
      // Resetear tipo en caso de error
      setTipoSeleccionado(null);
    }
  };

  const handleSubmit = async (values: CreatePersonaDto | UpdatePersonaDto) => {
    modal.setIsSubmitting(true);
    try {
      const tipo = tipoSeleccionado ?? modal.selectedItem?.tipo_persona;
      if (!tipo) {
        toast.error("No se pudo determinar el tipo de persona");
        return;
      }

      if (modal.isEditMode && modal.selectedItem) {
        // En edición: construir payload sin campos innecesarios
        const payload = buildPersonaPayload(values, tipo, true);
        await personasService.update(modal.selectedItem.id, payload);
        toast.success("Persona actualizada correctamente");
      } else {
        // En creación: agregar tipo_persona al payload
        const payload = buildPersonaPayload(values, tipo, false);
        await personasService.create(payload);
        toast.success("Persona creada correctamente");
      }
      modal.close();
      onSuccess();
    } catch (error) {
      toast.error(
        modal.isEditMode
          ? "Error al actualizar persona"
          : "Error al crear persona",
      );
    } finally {
      modal.setIsSubmitting(false);
    }
  };

  return {
    modal,
    tipoSeleccionado,
    typeSelectorOpen,
    setTypeSelectorOpen,
    openTypeSelector,
    handleTipoSelected,
    handleEdit,
    handleSubmit,
  };
};
