// src/layouts/AuthLayout.tsx
/*Es un placeholder donde se renderizan las rutas hijas.*/
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: "var(--color-bg-subtle)" }}
  >
    <Outlet />
  </div>
);
export default AuthLayout;
