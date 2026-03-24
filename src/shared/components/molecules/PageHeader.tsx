// src/shared/components/molecules/PageHeader.tsx
import { Breadcrumb } from "antd";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Acciones del lado derecho (botones de crear, exportar, etc.) */
  actions?: React.ReactNode;
}

/**
 * PageHeader — Cabecera estándar de cada módulo.
 * Estandariza: título + breadcrumb + acciones.
 * Todos los módulos del Paso 10 lo usarán.
 */
export const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) => {
  const breadcrumbItems = [
    {
      title: (
        <Link
          to={APP_ROUTES.DASHBOARD.HOME}
          className="flex items-center gap-1"
        >
          <Home size={14} />
        </Link>
      ),
    },
    ...breadcrumbs.map((item) => ({
      title: item.path ? (
        <Link to={item.path}>{item.label}</Link>
      ) : (
        <span>{item.label}</span>
      ),
    })),
  ];

  return (
    <div className="mb-6">
      <Breadcrumb
        items={breadcrumbItems}
        className="mb-3"
        style={{ fontSize: "0.8125rem" }}
      />

      <div
        className="flex items-start justify-between gap-4
                      flex-wrap"
      >
        <div>
          <h1
            className="text-2xl font-bold m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-1 text-sm m-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
};
