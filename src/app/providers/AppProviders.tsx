// src/app/providers/AppProviders.tsx
import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import esES from "antd/locale/es_ES";
import { lightTheme, darkTheme } from "@/config/theme.config";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/store/auth.store";
import Spinner from "@/shared/components/molecules/Spinner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { isDark } = useTheme();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [isBootstrappingAuth, setIsBootstrappingAuth] = useState(true);

  /**
   * initializeAuth solo durante el arranque de la app.
   * Importante: NO bloquear el árbol completo con auth.isLoading,
   * porque ese flag también se usa en login/logout y desmontaría el router.
   */
  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        await initializeAuth();
      } finally {
        if (isMounted) {
          setIsBootstrappingAuth(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [initializeAuth]);

  /**
   * Pantalla de carga inicial — evita flash de login
   * cuando el usuario ya tiene sesión activa.
   */
  if (isBootstrappingAuth) {
    return <Spinner fullScreen text="Verificando sesión SARA..." size={40} />;
  }

  return (
    <ConfigProvider
      key={isDark ? "theme-dark" : "theme-light"}
      locale={esES}
      theme={isDark ? darkTheme : lightTheme}
    >
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
