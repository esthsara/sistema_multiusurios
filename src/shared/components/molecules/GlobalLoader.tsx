import React, { useEffect, useState } from "react";
import { useUIStore } from "@/shared/store/ui.store";

export const GlobalLoader: React.FC = () => {
  const { globalLoading, loadingText } = useUIStore();
  const [shouldRender, setShouldRender] = useState(globalLoading);

  useEffect(() => {
    if (globalLoading) setShouldRender(true);
  }, [globalLoading]);

  const onTransitionEnd = () => {
    if (!globalLoading) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${
        globalLoading ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "var(--color-bg-base)",
      }}
    >
      {/* GRID tipo sidebar */}
      <div
        className="absolute inset-0"
        style={{

          backgroundSize: "22px 22px",
          opacity: 0.4,
        }}
      />

      {/* Línea lateral glow (igual que sidebar) */}
      <div
        className="absolute right-6 top-[15%] bottom-[15%] w-[1px]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              transparent,
              var(--color-primary-600),
              transparent
            )
          `,
          opacity: 0.5,
        }}
      />

      {/* CORE */}
      <div className="relative flex items-center justify-center">
        {/* Glow base */}
        <div
          className="absolute w-32 h-32 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary-500), transparent)",
            opacity: 0.5,
          }}
        />

        {/* Anillo externo fino */}
        <div
          className="absolute w-24 h-24 rounded-full animate-spin"
          style={{
            border: "1px solid transparent",
            borderTop: "1px solid var(--color-primary-400)",
            borderRight: "1px solid var(--color-primary-300)",
            animationDuration: "1.4s",
          }}
        />

        {/* Anillo interno inverso */}
        <div
          className="absolute w-16 h-16 rounded-full animate-spin"
          style={{
            border: "1px solid transparent",
            borderBottom: "1px solid var(--color-primary-500)",
            borderLeft: "1px solid var(--color-primary-300)",
            animationDirection: "reverse",
            animationDuration: "1s",
          }}
        />

        {/* Núcleo */}
        <div
          className="w-4 h-4 rounded-full"
          style={{
            background: "var(--color-primary-500)",
            boxShadow: `
              0 0 10px var(--color-primary-500),
              0 0 25px var(--color-primary-600)
            `,
          }}
        />
      </div>

      {/* TEXTO */}
      <p
        className="mt-6 text-xs tracking-[0.25em] uppercase animate-pulse"
        style={{
          color: "var(--color-primary-300)",
        }}
      >
        {loadingText || "Cargando sistema"}
      </p>
    </div>
  );
};
