// src/app/providers/AppProviders.tsx
import { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import esES from "antd/locale/es_ES";
import { lightTheme, darkTheme } from "@/config/theme.config";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { GlobalLoader } from "@/shared/components/molecules/GlobalLoader";
import { SessionExpiredModal } from "@/shared/components/organisms/SessionExpiredModal";
import { useUIStore } from "@/shared/store/ui.store";

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
    const { setGlobalLoading } = useUIStore.getState();
    
    // Mostramos el GlobalLoader durante el inicio
    setGlobalLoading(true, "Verificando sesión");

    const bootstrapAuth = async () => {
      try {
        await initializeAuth();
      } finally {
        if (isMounted) {
          setIsBootstrappingAuth(false);
          setGlobalLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [initializeAuth]);

  return (
    <ConfigProvider
      key={isDark ? "theme-dark" : "theme-light"}
      locale={esES}
      theme={isDark ? darkTheme : lightTheme}
    >
      <GlobalLoader />

      {/* 
        Modal de sesión expirada — montado aquí para ser independiente
        del router y estar activo en toda la app desde el arranque.
      */}
      <SessionExpiredModal />

      {/* 
        Evitamos renderizar los children (router) hasta validar la sesión, 
        previniendo redireccionamientos prematuros ("flickers") hacia el login.
      */}
      {!isBootstrappingAuth && children}

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
