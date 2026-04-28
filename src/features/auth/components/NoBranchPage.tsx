// src/features/auth/components/NoBranchPage.tsx
import { Building2 } from "lucide-react";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

/**
 * NoBranchPage — Se muestra cuando un usuario está autenticado
 * pero no tiene ninguna sucursal asignada en el sistema.
 *
 * El AuthGuard redirige aquí en lugar de dejar al usuario navegar
 * con X-Sucursal-ID vacío, lo que rompería todas las peticiones.
 *
 * El usuario DEBE contactar a un administrador para que le asigne
 * acceso a una sucursal antes de poder usar la aplicación.
 */
const NoBranchPage = () => {
  const { logout } = useAuthActions();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg-base)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          backgroundColor: "var(--color-bg-base-2)",
          borderRadius: 16,
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Icono */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "var(--color-bg-overlay)",
            marginBottom: 24,
          }}
        >
          <Building2
            size={32}
            style={{ color: "var(--color-primary-400)" }}
          />
        </div>

        {/* Título */}
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: 12,
            margin: "0 0 12px 0",
          }}
        >
          Sin sucursal asignada
        </h1>

        {/* Descripción */}
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          Tu cuenta no tiene acceso a ninguna sucursal en este momento.
          Comunícate con el administrador del sistema para que te asigne
          los permisos correspondientes.
        </p>

        {/* Botón de logout */}
        <button
          onClick={logout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 28px",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            backgroundColor: "transparent",
            color: "var(--color-text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-bg-overlay)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default NoBranchPage;
