const HomePage = () => {
  return (
    <div className="p-8 flex flex-wrap gap-4">
      {/* PRIMARY */}
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-primary-50)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-primary-200)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-primary-400)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-primary-600)" }}
      />
      
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-primary-700)" }}
      />

      {/* SUCCESS */}
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-success-500)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-success-600)" }}
      />

      {/* WARNING */}
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-warning-500)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-warning-600)" }}
      />

      {/* DANGER */}
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-danger-500)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-danger-600)" }}
      />

      {/* BACKGROUND */}
      <div
        className="w-10 h-10 border"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      />
      <div
        className="w-10 h-10 border"
        style={{ backgroundColor: "var(--color-bg-base-2)" }}
      />
      <div
        className="w-10 h-10 border"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
      />
      <div
        className="w-10 h-10 border"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}
      />
      <div
        className="w-10 h-10 border"
        style={{ backgroundColor: "var(--color-bg-filter)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-bg-sidebar)" }}
      />

      {/* BORDER */}
      <div
        className="w-10 h-10 border-4"
        style={{ borderColor: "var(--color-border)" }}
      />
      <div
        className="w-10 h-10 border-4"
        style={{ borderColor: "var(--color-border-focus)" }}
      />

      {/* TEXT (simulado con fondo) */}
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-text-primary)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-text-secondary)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-text-disabled)" }}
      />
      <div
        className="w-10 h-10"
        style={{ backgroundColor: "var(--color-text-inverse)" }}
      />
    </div>
  );
};

export default HomePage;
