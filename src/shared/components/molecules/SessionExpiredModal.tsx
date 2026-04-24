// src/shared/components/molecules/SessionExpiredModal.tsx
import { useState, useCallback } from "react";
import { Modal } from "antd";
import { Clock } from "lucide-react";
import { useSessionWarning } from "@/shared/hooks/useSessionWarning";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * SessionExpiredModal — Modal de UX limpio para dos estados:
 *
 * MODO AVISO (warnMode = true):
 *   Aparece 5 minutos antes de que expire la sesión.
 *   El usuario puede cerrarlo y seguir trabajando.
 *
 * MODO EXPIRADO (warnMode = false):
 *   Aparece cuando el tiempo de sesión se agotó localmente.
 *   No se puede cerrar sin iniciar sesión nuevamente.
 *   El logout ya se ejecutó antes de mostrar este modal.
 *
 * IMPORTANTE:
 * - No muestra errores técnicos ni pantallasos rojos.
 * - El logout se ejecuta en el interceptor de Axios (401) o en el timer.
 * - Este modal solo gestiona la comunicación visual al usuario.
 */
export const SessionExpiredModal = () => {
  const [open, setOpen] = useState(false);
  const [warnMode, setWarnMode] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const handleWarningSoon = useCallback(() => {
    setWarnMode(true);
    setOpen(true);
  }, []);

  const handleExpired = useCallback(async () => {
    setWarnMode(false);
    setOpen(true);
    // Ejecutar logout silencioso al expirar por tiempo local
    await logout();
    window.location.replace(APP_ROUTES.LOGIN);
  }, [logout]);

  useSessionWarning({
    onWarningSoon: handleWarningSoon,
    onExpired: handleExpired,
  });

  const handleLoginAgain = useCallback(async () => {
    setOpen(false);
    // Si aún no se hizo logout (raro pero posible), hacerlo ahora
    await logout();
    window.location.replace(APP_ROUTES.LOGIN);
  }, [logout]);

  return (
    <Modal
      open={open}
      // En modo aviso el usuario puede cerrarlo; en modo expirado, no
      closable={warnMode}
      mask={{ closable: warnMode }}
      keyboard={warnMode}
      footer={null}
      centered
      width={400}
      onCancel={() => {
        if (warnMode) setOpen(false);
      }}
      style={{ borderRadius: 16 }}
      styles={{
        body: {
          padding: "40px 36px",
          textAlign: "center",
        },
      }}
    >
      {/* Icono */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: warnMode
            ? "rgba(250, 173, 20, 0.12)"
            : "rgba(var(--color-primary-rgb, 99, 102, 241), 0.1)",
          marginBottom: 20,
        }}
      >
        <Clock
          size={28}
          style={{
            color: warnMode ? "#faad14" : "var(--color-primary-500)",
          }}
        />
      </div>

      {/* Título */}
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          margin: "0 0 10px 0",
        }}
      >
        {warnMode
          ? "Tu sesión expirará pronto"
          : "Tu sesión ha expirado por seguridad"}
      </h3>

      {/* Descripción */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.65,
          margin: "0 0 28px 0",
        }}
      >
        {warnMode
          ? "En menos de 5 minutos tu sesión se cerrará automáticamente. Guarda tu trabajo para no perder cambios."
          : "Por tu seguridad, cerramos la sesión automáticamente después del tiempo límite de actividad."}
      </p>

      {/* Acción */}
      {warnMode ? (
        <button
          onClick={() => setOpen(false)}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 8,
            border: "none",
            backgroundColor: "var(--color-primary-500)",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Continuar trabajando
        </button>
      ) : (
        <button
          onClick={handleLoginAgain}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 8,
            border: "none",
            backgroundColor: "var(--color-primary-500)",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Iniciar sesión nuevamente
        </button>
      )}
    </Modal>
  );
};
