// src/layouts/DashboardLayout.tsx

import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

const { Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      {/* Área principal */}
      <Layout style={{ backgroundColor: "var(--color-bg-base-2)" }}>
        {/* Header */}
        <Header
          collapsed={collapsed}
          onToggle={toggleCollapse}
          onMobileOpen={openMobile}
        />

        {/* Contenido */}
        <Content
          className="p-4 md:p-6"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
