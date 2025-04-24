import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  EyeOutlined,
  HomeOutlined,
  KeyOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AiOutlineCaretLeft, AiOutlineCaretRight } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

const SiderBar: React.FC = () => {
  const { isAuth } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const [isAdmin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const value = localStorage.getItem("admin");
    if (value === "true") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [isAdmin]);
  

  useEffect(() => {
    switch (location.pathname) {
      case '/seller':
        setSelectedKey('1');
        break;
      case '/property':
        setSelectedKey('2');
        break;
      case '/visit':
        setSelectedKey('3');
        break;
      case '/asesor':
        setSelectedKey('4');
        break;
      case '/login':
        setSelectedKey('login');
        break;
      default:
        setSelectedKey('');
    }
  }, [location]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems: MenuProps['items'] = isAuth
    ? [
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
        },
        ...( isAdmin
          ? [
              {

                key: '4',
                icon: <StarOutlined />,
                label: <Link to="/asesor">Asesores</Link>,
              },
            ]
          : []),
      ]
    : [
        {
          key: 'login',
          icon: <KeyOutlined />,
          label: <Link to="/login">Iniciar Sesión</Link>,
        },
      ];


  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      trigger={null}
    >
      <div style={{ position: 'sticky', top: 70, zIndex: 1, overflow: 'hidden' }}>
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
