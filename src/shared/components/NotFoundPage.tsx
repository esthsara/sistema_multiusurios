// src/shared/components/NotFoundPage.tsx
import { Button, Result } from "antd";
import { Telescope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      icon={
        <Telescope
          size={72}
          style={{ color: "var(--color-primary-500)" }}
        />
      }
      title="404 — Página no encontrada"
      subTitle="Lo sentimos, la página que intentas visitar no existe o ha sido movida."
      extra={
        <Button
          type="primary"
          onClick={() => navigate(APP_ROUTES.DASHBOARD.HOME, { replace: true })}
        >
          Volver al inicio
        </Button>
      }
      style={{ paddingBlock: "80px" }}
    />
  );
};

export default NotFoundPage;
