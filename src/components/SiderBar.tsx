import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import {
  CalendarOutlined,
  EyeOutlined,
  HomeOutlined,
  KeyOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const iconSize = 32;

const pathToKeyMap: Record<string, string> = {
  '/': 'agenda',
  '/seller': 'seller',
  '/property': 'property',
  '/visit': 'visit',
  '/asesor': 'asesor',
  '/login': 'login',
};

const SiderBar: React.FC = () => {
  const { isAuth } = useAuth();
  const location = useLocation();

  const [isAdmin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const value = localStorage.getItem('admin');
    setAdmin(value === 'true');
  }, []);

  const selectedKey = pathToKeyMap[location.pathname] || '';

  const items = isAuth
    ? [
        { key: 'agenda', icon: <CalendarOutlined style={{ fontSize: iconSize }} />, label: 'Agenda', path: '/' },
        { key: 'seller', icon: <UserOutlined style={{ fontSize: iconSize }} />, label: 'Clientes', path: '/seller' },
        { key: 'property', icon: <HomeOutlined style={{ fontSize: iconSize }} />, label: 'Propiedades', path: '/property' },
        { key: 'visit', icon: <EyeOutlined style={{ fontSize: iconSize }} />, label: 'Visitas', path: '/visit' },
        ...(isAdmin ? [{ key: 'asesor', icon: <StarOutlined style={{ fontSize: iconSize }} />, label: 'Asesores', path: '/asesor' }] : []),
      ]
    : [{ key: 'login', icon: <KeyOutlined style={{ fontSize: iconSize }} />, label: 'Entrar', path: '/login' }];

  return (
    <div
      style={{
        height: '100%',
        paddingTop: 16,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >

      <Row
        gutter={[0, 12]}
        justify="center"
        style={{ width: '100%', padding: '0 8px' }}
      >
        {items.map(({ key, icon, label, path }) => (
          <Col
            key={key}
            span={24}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: selectedKey === key ? '#1890ff' : 'transparent',
              borderRadius: 6,
              padding: '8px 0',
              transition: 'background-color 0.3s',
              userSelect: 'none',
            }}
          >
            <Link
              to={path}
              style={{
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: 12,
              }}
            >
              {icon}
              <span style={{ marginTop: 5 }}>{label}</span>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SiderBar;
