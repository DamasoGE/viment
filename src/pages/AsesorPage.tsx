import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Switch, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAsesor, { Asesor } from '../hooks/useAsesor';
import { ColumnsType } from 'antd/es/table';

const AsesorPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const { asesors, loading, error, fetchAllAsesores, updateAsesor, user } = useAsesor(); 

  const [asesorFilter, setAsesorFilter] = useState<Asesor[]>([]);

  useEffect(() => {
    const aux = async () => {
        await fetchAllAsesores();
    }
    aux();
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
  },[searchTerm, asesors]);

  const handleAdminChange = async (asesorId: string, adminStatus: boolean) => {
    try {
      if (!asesorId) {
        console.error("ID del asesor no encontrado");
        return;
      }
      await updateAsesor(asesorId, { admin: adminStatus });
      // Recargar los asesores después de actualizar
      fetchAllAsesores();
    } catch (error) {
      console.error('Error al cambiar el estado de administrador:', error);
    }
  };

  const columns: ColumnsType<Asesor> = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Administrador',
      dataIndex: 'admin',
      key: 'admin',
      render: (admin: boolean, asesor) => (
        <Switch 
          checked={admin} 
          onChange={(checked: boolean) => {
            // Verificar si el ID del asesor es el mismo que el del usuario actual
            if (asesor._id && asesor._id !== user?._id) {
              handleAdminChange(asesor._id, checked);
            }
          }} 
          disabled={asesor._id === user?._id} // Deshabilitar si es el propio usuario
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, asesor) => (
        <Space size="middle">
          <Link to={`/asesor/${asesor._id}`}>
            Ver detalles
          </Link>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <Spin tip="Cargando visita...">
        <div style={{ width: 200, height: 100 }} />
      </Spin>
    </div>
  ) 
  }

  if (error) {
    navigate('/error');
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Buscar por username o administrador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 20 }}
        />

        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => {
            navigate('/asesor/new');
          }}
        >
          Crear Nuevo Asesor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={asesorFilter}
        rowKey="_id"
      />
    </div>
  );
};

export default AsesorPage;
