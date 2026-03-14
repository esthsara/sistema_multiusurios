// src/app/providers/AppProviders.tsx
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { lightTheme, darkTheme } from "@/config/theme.config";
import { useTheme } from "@/shared/hooks/useTheme";

interface AppProvidersProps {
  children: React.ReactNode;
  /**
   * React.ReactNode — ¿por qué no JSX.Element?
   * ReactNode acepta strings, arrays, null y fragments.
   * JSX.Element es más restrictivo y causaría errores
   * con ciertos patrones de composición.
   */
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider locale={esES} theme={isDark ? darkTheme : lightTheme}>
      {children}
    </ConfigProvider>
  );
};
