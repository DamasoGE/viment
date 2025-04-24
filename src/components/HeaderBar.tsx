import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Usamos useNavigate para redirigir
import { useAuth } from '../hooks/useAuth';
import { IdcardOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

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
    <Header style={{ height:"50px" ,display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3} style={{ color: 'white', margin: 0 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>VIMENT</Link>
      </Title>

      <div style={{ display: 'flex', alignItems: 'center' }}>
      {user && isAuth ? (
        <>
          <IdcardOutlined style={{ color: 'white' }} />
          <Typography.Text style={{ color: 'white', marginRight: '20px', marginLeft: '5px' }}>
            <Link to={`/profile`} style={{ color: 'white' }}>
              {user}
            </Link>
          </Typography.Text>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <></>
      )}


      </div>
    </Header>
  );
};

export default HeaderBar;
