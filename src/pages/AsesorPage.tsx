import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Switch, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { IoSearchCircleOutline } from 'react-icons/io5';
import { SettingOutlined } from '@ant-design/icons';
import { HeaderPageContainer } from '../styles/theme';
import CenteredSpin from '../components/CenteredSpin';
import { useAuth } from '../hooks/useAuth';
import useAsesor, { Asesor } from '../hooks/useAsesor';

const AsesorPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const {
    asesors,
    loading,
    fetchAllAsesores,
    updateAsesor,
  } = useAsesor();

  const [asesorFilter, setAsesorFilter] = useState<Asesor[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/error', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const init = async () => {
      await fetchAllAsesores();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = asesors.filter((asesor) =>
        asesor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asesor.admin.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAsesorFilter(filtered);
    } else {
      setAsesorFilter(asesors);
    }
  }, [asesors, searchTerm]);

  const handleAdminChange = async (asesorId: string, adminStatus: boolean) => {
    if (!asesorId) {
      console.error("ID del asesor no encontrado");
      return;
    }
    const success = await updateAsesor(asesorId, { admin: adminStatus });
    if (success) {
      await fetchAllAsesores();
    }
  };

  const columns: ColumnsType<Asesor> = [
    {
      title: 'Acciones',
      width: 100,
      align: 'center',
      key: 'actions',
      render: (_, asesor) => (
        <Space>
          <Link to={`/asesor/${asesor._id}`}>
            <SettingOutlined style={{ color: "black", fontSize: "18px" }} />
          </Link>
        </Space>
      ),
    },
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Administrador',
      dataIndex: 'admin',
      key: 'admin',
      render: (admin: boolean, asesor) => {
        const isSelf = asesor._id === user?._id;
        return (
          <Switch
            checked={admin}
            onChange={(checked: boolean) => {
              if (!isSelf && asesor._id) {
                handleAdminChange(asesor._id, checked);
              }
            }}
            disabled={isSelf}
          />
        );
      },
    },
  ];

  if (loading) {
    return <CenteredSpin tipText='Cargando Asesores...' />;
  }

  return (
    <>
      <HeaderPageContainer>
        <Input
          placeholder="Buscar por username o administrador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
          style={{ width: 320 }}
        />
        <Button
          type="primary"
          style={{ height: 40 }}
          onClick={() => navigate('/asesor/new')}
        >
          Crear Nuevo Asesor
        </Button>
      </HeaderPageContainer>

      <Table
        columns={columns}
        dataSource={asesorFilter}
        rowKey="_id"
        locale={{
        emptyText: <Empty description="No hay datos para ese filtro" />,
        }}
      />
    </>
  );
};

export default AsesorPage;
