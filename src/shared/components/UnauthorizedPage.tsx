// src/shared/components/UnauthorizedPage.tsx
import { Button, Result } from "antd";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

/**
 * UnauthorizedPage — Pantalla 403 explícita.
 *
 * Se muestra cuando el usuario intenta acceder a una ruta para la cual
 * no tiene el permiso requerido. Reemplaza la redirección silenciosa
 * al home para dar feedback claro al usuario.
 */
export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      icon={
        <ShieldX
          size={72}
          style={{ color: "var(--color-warning-500, #f59e0b)" }}
        />
      }
      title="Acceso no autorizado"
      subTitle="No tienes permisos para ver esta página. Contacta al administrador si crees que esto es un error."
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

export default UnauthorizedPage;
