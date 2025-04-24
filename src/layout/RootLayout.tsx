import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import SiderBar from "../components/SiderBar";
import HeaderBar from "../components/HeaderBar";
import FooterBar from "../components/FooterBar";
import { useAuth } from "../hooks/useAuth";
import useAsesor from "../hooks/useAsesor";

const { Content } = Layout;

const RootLayout: React.FC = () => {
  const { isAuth } = useAuth();
  const { isAdmin } = useAsesor();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <HeaderBar />
      </div>

      <Layout>
        <SiderBar key={`${isAuth}-${isAdmin}`} /> {/* La key sirve para que al haber un cambio en esta se vuelva a renderizar el componente */}
        <Layout style={{ flex: 1 }}>
          <Content
            style={{
              overflowY: "auto",
              height: "100%",
              padding: "16px",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {/* Footer */}
      <div style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
        <FooterBar />
      </div>
    </Layout>
  );
};

export default RootLayout;
