import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { EyeOutlined, HomeOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider } = Layout;

const SiderBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const { isAuth } = useAuth();
  const location = useLocation();


  useEffect(() => {
    // Se actualiza la key seleccionada en base a la ruta actual
    if (location.pathname === '/seller') {
      setSelectedKey('1'); // O el valor correspondiente si es la página Home
    } else if (location.pathname === '/property') {
      setSelectedKey('2');
    } else if (location.pathname === '/visit') {
      setSelectedKey('3');
    } else {
      setSelectedKey('');
    }
  }, [location]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = isAuth ? [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/seller">Clientes</Link>,
    },
    {
      key: '2',
      icon: <HomeOutlined />,
      label: <Link to="/property">Propiedades</Link>,
    },
    {
      key: '3',
      icon: <EyeOutlined />,
      label: <Link to="/visit">Visitas</Link>,
    }
  ] : [
    {
      key: '3',
      icon: <KeyOutlined />,
      label: <Link to="/login">Iniciar Sesión</Link>,
    }
  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={toggleCollapsed}
      trigger={null}
    >
      <div style={{ position: "sticky", top: 70, zIndex: 1, overflow: "hidden" }}>


        <div
          style={{
            position: 'absolute',
            color: 'white',
            top: '2px',
            right: '-10px',
            fontSize: '30px',
            padding: '5px',
            cursor: 'pointer',
            zIndex: 10,
          }}
          onClick={toggleCollapsed}
        >
          {collapsed ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
        </div>

        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]}
          items={menuItems} 
          onClick={({ key }) => setSelectedKey(key)}
        />
      </div>
    </Sider>
  );
};

export default SiderBar;
