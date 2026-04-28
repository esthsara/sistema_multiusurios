import React from "react";

interface SpinnerProps {
  size?: number; // tamaño en px
  text?: string; // texto opcional
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, text }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="animate-spin rounded-full border-2 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: "var(--color-primary-600)",
          borderTopColor: "transparent",
        }}
      />
      {text && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Spinner;
