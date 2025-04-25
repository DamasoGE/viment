import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Tag, Dropdown, Menu, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useVisit, { Visit } from '../hooks/useVisit';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';

const VisitPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const { visits, loading, error, updateVisit } = useVisit();
  const [visitFilter, setVisitFilter] = useState<Visit[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = visits.filter((visit) =>
        visit.property?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.status?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setVisitFilter(filtered);
    } else {
      setVisitFilter(visits);
    }
  }, [searchTerm, visits]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'gold';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const statusTextMap: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  const handleStatusChange = async (visitId: string, status: string) => {
    try {
      await updateVisit(visitId, "status",  status );
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const columns: ColumnsType<Visit> = [
    {
      title: 'Cita',
      dataIndex: 'appointment',
      key: 'appointment',
      render: (appointment: Date) => new Date(appointment).toLocaleString(),
    },
    {
      title: 'Propiedad',
      dataIndex: 'property',
      key: 'property',
      render: (_, visit) =>
        visit.property ? (
          <Link to={`/property/${visit.property._id}`}>
            {visit.property.address}
          </Link>
        ) : (
          'No asignada'
        ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, visit: Visit) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(visit._id, key)}
            items={[
              { key: 'pending', label: 'Pendiente' },
              { key: 'completed', label: 'Completada' },
              { key: 'cancelled', label: 'Cancelada' },
            ]}
          />
        );

        return (
          <>
            <Tag color={getStatusColor(status)}>
              {statusTextMap[status]}
            </Tag>
            <Dropdown overlay={menu} trigger={['click']}>
              <EditOutlined />
            </Dropdown>
          </>

        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, visit) => (
        <Space size="middle">
          <Link to={`/visit/${visit._id}`}>
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
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Buscar por dirección de propiedad o estado"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 20 }}
        />

        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => navigate('/visit/new')}
        >
          Crear Nueva Visita
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={visitFilter}
        rowKey="_id"
      />
    </div>
  );
};

export default VisitPage;
