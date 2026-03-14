// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div
    className="min-h-screen"
    style={{ backgroundColor: "var(--color-bg-base)" }}
  >
    <p className="p-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
      Dashboard Layout — Sidebar en Paso 8
    </p>
    <Outlet />
  </div>
);
export default DashboardLayout;
