/** Permisos que se clasifican como "alto impacto" */
export const ACCIONES_CRITICAS = [
  "eliminar",
  "eliminar_permanente",
  "exportar",
];

export const formatPermiso = (permiso: string) => {
  const [modulo = "general", accion = "acceso"] = permiso.split(".");
  return {
    modulo: modulo.replaceAll("_", " "),
    accion: accion.replaceAll("_", " "),
  };
};

export const agruparPermisosPorModulo = (
  permisos: string[],
): Record<string, string[]> => {
  return permisos.reduce(
    (acc, permiso) => {
      const { modulo } = formatPermiso(permiso);
      if (!acc[modulo]) {
        acc[modulo] = [];
      }
      acc[modulo].push(permiso);
      return acc;
    },
    {} as Record<string, string[]>,
  );
};

export const obtenerTonePermiso = (permiso: string): "success" | "danger" => {
  return ACCIONES_CRITICAS.some((a) => permiso.endsWith(`.${a}`))
    ? "danger"
    : "success";
};
