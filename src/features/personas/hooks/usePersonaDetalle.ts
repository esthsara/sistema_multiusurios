// src/features/personas/hooks/usePersonaDetalle.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { personasService } from "../services/personas.service";
import type { PersonaDetalle } from "../types/persona.types";

export const usePersonaDetalle = (id: number) => {
  const [persona, setPersona] = useState<PersonaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPersona = useCallback(async () => {
    setLoading(true);
    try {
      const res = await personasService.getById(id);
      setPersona(res.data);
    } catch {
      toast.error("Error al cargar la persona");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersona();
  }, [fetchPersona]);

  return { persona, loading, refetch: fetchPersona };
};
