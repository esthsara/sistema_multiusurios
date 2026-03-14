// src/app/providers/AppProviders.tsx  — actualización
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import esES from "antd/locale/es_ES";
import { lightTheme, darkTheme } from "@/config/theme.config";
import { useTheme } from "@/shared/hooks/useTheme";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider locale={esES} theme={isDark ? darkTheme : lightTheme}>
      {children}

      {/* ToastContainer — una sola instancia para toda la app */}
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
