import React from 'react';
import { Layout, Typography, Button, Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IdcardOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user, isAuth } = useAuth();

  const handleLogout = async () => {
    const logoutsuccess = await logout();
    if (logoutsuccess) {
      navigate("/login");
    } else {
      console.log("Error de logout");
    }
  };

  return (
    <Header
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      {isAuth && (
        <Image
          src="/img/logo-login.png"
          alt="Logo"
          preview={false}
          style={{
            width: 50,
            marginLeft: 10
          }}
        />
      )}

      <Title
        level={3}
        style={{
          color: "white",
          margin: 0,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          userSelect: "none",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          VIMENT
        </Link>
      </Title>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {user && isAuth ? (
          <>
            <IdcardOutlined style={{ color: "white" }} />
            <Text style={{ color: "white" }}>
              <Link to={`/profile`} style={{ color: "white" }}>
                {user.username}
              </Link>
            </Text>
            <Button type="primary" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        ) : null}
      </div>
    </Header>
  );
};

export default HeaderBar;
