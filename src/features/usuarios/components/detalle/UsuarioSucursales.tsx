import { Building2 } from "lucide-react";
import type { UsuarioDetalle } from "../../types/usuario.types";
import { AppTag } from "@/shared/components/atoms/AppTag";
import { SucursalTable } from "./Sucursal/SucursalTable";

interface UsuarioSucursalesProps {
  usuario: UsuarioDetalle;
}

export const UsuarioSucursales = ({ usuario }: UsuarioSucursalesProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-semibold text-base m-0"
          style={{ color: "var(--color-text-primary)" }}
        >
          Sucursales Asignadas
        </h3>
        <AppTag tone="blue">{usuario.sucursales.length} sucursales</AppTag>
      </div>

      {usuario.sucursales.length === 0 ? (
        <div
          className="text-center py-8"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Building2 size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Este usuario no tiene sucursales asignadas</p>
        </div>
      ) : (
        <SucursalTable data={usuario.sucursales} />
      )}
    </div>
  );
};
