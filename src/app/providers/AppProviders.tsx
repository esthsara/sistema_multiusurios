// src/app/providers/AppProviders.tsx
import { useEffect } from "react";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import esES from "antd/locale/es_ES";
import { lightTheme, darkTheme } from "@/config/theme.config";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { isDark } = useTheme();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  /**
   * initializeAuth al montar la app.
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Pantalla de carga inicial — evita flash de login
   * cuando el usuario ya tiene sesión activa.
   */
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-spin rounded-full h-10 w-10
                          border-2 border-[var(--color-primary-600)]
                          border-t-transparent"
          />
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider locale={esES} theme={isDark ? darkTheme : lightTheme}>
      {children}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        toastStyle={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
        }}
      />
    </ConfigProvider>
  );
};
