// src/shared/hooks/useSessionWarning.ts
import { useEffect, useRef, useCallback } from "react";
import { tokenManager } from "@/shared/utils/tokenManager";
import { useAuthStore } from "@/features/auth/store/auth.store";

/** Avisa 5 minutos antes de que expire la sesión */
const WARNING_BEFORE_MS = 5 * 60 * 1000;

interface UseSessionWarningOptions {
  /** Se llama cuando quedan ~5 minutos para la expiración */
  onWarningSoon: () => void;
  /** Se llama cuando la sesión expiró por tiempo local */
  onExpired: () => void;
}

/**
 * useSessionWarning — Programa dos timers al iniciar sesión:
 *
 * 1. Timer de AVISO  → se activa 5 minutos antes de la expiración.
 * 2. Timer de EXPIRACIÓN → se activa cuando el tiempo local se agota.
 *
 * Ambos timers se cancelan automáticamente si el usuario cierra sesión
 * antes de que se cumplan los tiempos.
 *
 * IMPORTANTE: Este hook controla solo la UX del frontend.
 * La seguridad real la garantiza el backend al rechazar tokens vencidos.
 */
export const useSessionWarning = ({
  onWarningSoon,
  onExpired,
}: UseSessionWarningOptions) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Refs para poder cancelar los timers antes de que disparen
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (warnTimerRef.current) {
      clearTimeout(warnTimerRef.current);
      warnTimerRef.current = null;
    }
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current);
      expireTimerRef.current = null;
    }
    warnedRef.current = false;
  }, []);

  useEffect(() => {
    // Sin sesión activa → limpiar timers y no hacer nada
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    const remaining = tokenManager.getRemainingMs();

    // Si no hay loginTime registrado no podemos programar timers
    if (remaining === null) return;

    // Sesión ya expirada localmente → disparar expiración inmediata
    if (remaining === 0) {
      onExpired();
      return;
    }

    // Timer de AVISO (5 min antes)
    const warnIn = remaining - WARNING_BEFORE_MS;
    if (warnIn > 0) {
      warnTimerRef.current = setTimeout(() => {
        if (!warnedRef.current) {
          warnedRef.current = true;
          onWarningSoon();
        }
      }, warnIn);
    } else {
      // Menos de 5 minutos para expirar → mostrar aviso de inmediato
      if (!warnedRef.current) {
        warnedRef.current = true;
        onWarningSoon();
      }
    }

    // Timer de EXPIRACIÓN
    expireTimerRef.current = setTimeout(() => {
      onExpired();
    }, remaining);

    return () => {
      clearTimers();
    };
  }, [isAuthenticated, onWarningSoon, onExpired, clearTimers]);
};
