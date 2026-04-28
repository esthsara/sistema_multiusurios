import type { UsuarioListItem } from "../types/usuario.types";

type PersonaShape = UsuarioListItem["persona"];

export const getPersonaDisplayName = (persona: PersonaShape): string => {
  const nombre = `${persona.nombre ?? ""} ${persona.apellido ?? ""}`.trim();
  return (persona.razon_social ?? nombre).trim() || "Sin nombre";
};

export const getUsuarioDisplayName = (
  usuario: Pick<UsuarioListItem, "persona">,
): string => getPersonaDisplayName(usuario.persona);

export const getUsuarioInitials = (
  usuario: Pick<UsuarioListItem, "persona">,
): string => {
  const displayName = getUsuarioDisplayName(usuario);
  return (
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};
