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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 transition-opacity duration-300 ${
        globalLoading ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundColor: "var(--color-bg-filter)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Glow usando tu primary */}
        <div
          className="absolute w-20 h-20 rounded-full blur-2xl animate-pulse"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        />

        {/* Spinner */}
        <div
          className="w-14 h-14 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-primary-600)",
          }}
        />
      </div>

      {/* Texto */}
      <p
        className="text-sm font-medium tracking-wide"
        style={{ color: "var(--color-text-primary)" }}
      >
        {loadingText || "Cargando..."}
      </p>
    </div>
  );
};
