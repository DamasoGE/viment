import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import SiderBar from "../components/SiderBar";
import HeaderBar from "../components/HeaderBar";
import FooterBar from "../components/FooterBar";
import { ScrollContainer } from "../styles/theme";

const { Sider, Footer } = Layout;

const RootLayout: React.FC = () => {

  return (

    <Layout style={{ height: "100vh" }}>

      {/* HEADER */}
      <HeaderBar />

      {/* MAIN: Sider + Outlet */}
      <Layout>
        
        <Sider width={100}>
          <SiderBar/>
        </Sider>

        <ScrollContainer>
          <Outlet />
        </ScrollContainer>

      </Layout>

      {/* FOOTER */}
      <Footer style={{ textAlign: "center", padding: "8px 16px" }}>
        <FooterBar />
      </Footer>

    </Layout>
  );
};

export default RootLayout;
