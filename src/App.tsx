// src/app/App.tsx  — Solo para verificar que todo funciona
import { Button, Card } from "antd";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { AppProviders } from "@/app/providers/AppProviders";

const ThemeDemo = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-bg-base)" }}
    >
      <Card
        title="Sistema de Temas — Verificación"
        style={{ maxWidth: 480, margin: "0 auto" }}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>
          Tema activo: <strong>{theme}</strong>
        </p>

        <Button
          type="primary"
          icon={isDark ? <Sun size={16} /> : <Moon size={16} />}
          onClick={toggleTheme}
          className="mt-4"
        >
          {isDark ? "Cambiar a Light" : "Cambiar a Dark"}
        </Button>
      </Card>
    </div>
  );
};

const App = () => (
  <AppProviders>
    <ThemeDemo />
  </AppProviders>
);

export default App;
