// src/layouts/components/BranchSelector.tsx
import { Select } from "antd";
import { Building2 } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { safeText } from "@/shared/utils/sanitize";
import type { Sucursal } from "@/shared/types/auth.types";

interface BranchSelectorProps {
  collapsed?: boolean;
}
/*esta seccion es para cambair de sucursal segun lo que me legue */
export const BranchSelector = ({ collapsed }: BranchSelectorProps) => {
  const { sucursales, sucursalActiva } = useAuth();
  const setSucursalActiva = useAuthStore((s) => s.setSucursalActiva);

  // Si solo tiene una sucursal, mostramos solo el nombre
  if (sucursales.length <= 1) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{
          backgroundColor: "var(--color-bg-overlay)",
          maxWidth: collapsed ? 40 : 200,
        }}
      >
        <Building2
          size={15}
          style={{ color: "var(--color-primary-400)", flexShrink: 0 }}
        />
        {!collapsed && (
          <span
            className="text-xs font-medium truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {safeText(sucursalActiva?.nombre, "Sin sucursal", 80)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Building2
        size={15}
        style={{ color: "var(--color-primary-400)", flexShrink: 0 }}
      />
      {!collapsed && (
        <Select
          size="small"
          variant="borderless"
          value={sucursalActiva?.id}
          onChange={(id: number) => {
            const found = sucursales.find((s: Sucursal) => s.id === id);
            if (found) setSucursalActiva(found);
          }}
          options={sucursales.map((s: Sucursal) => ({
            value: s.id,
            label: safeText(s.nombre, "Sucursal", 80),
          }))}
          style={{
            minWidth: 140,
            color: "var(--color-text-primary)",
            fontSize: "0.75rem",
          }}
          dropdownStyle={{
            backgroundColor: "var(--color-bg-base-2)",
          }}
        />
      )}
    </div>
  );
};
