import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Tooltip, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useProperty, { Property } from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { IoSearchCircleOutline } from 'react-icons/io5';

const PropertyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const { properties, loading, error, updateProperty } = useProperty();
  const { visits } = useVisit();

  const [propertyFilter, setPropertyFilter] = useState<Property[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter((property) =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.seller?.username?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setPropertyFilter(filtered);
    } else {
      setPropertyFilter(properties);
    }
  }, [searchTerm, properties]);

  const changeCounter = async (property: Property, field: string, delta: number) => {
    const current = property[field as keyof Property] as number || 0;
    const newValue = Math.max(0, current + delta);
    await updateProperty(property._id!, field, newValue.toString());
  };

  const getNextVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    return propertyVisits
      .filter((visit) => new Date(visit.appointment) > new Date())
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime())[0];
  };

  const getPreviousVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    return propertyVisits
      .filter((visit) => new Date(visit.appointment) < new Date())
      .sort((a, b) => new Date(b.appointment).getTime() - new Date(a.appointment).getTime())[0];
  };

  const getTimesVisited = (propertyId: string): number => {
    return visits.filter(
      (visit) =>
        visit.property._id === propertyId && visit.status === 'completed'
    ).length;
  };

  const sortedProperties = propertyFilter.sort((a, b) => {
    const nextVisitA = getNextVisit(a._id!);
    const nextVisitB = getNextVisit(b._id!);
    if (!nextVisitA) return 1;
    if (!nextVisitB) return -1;
    return new Date(nextVisitA.appointment).getTime() - new Date(nextVisitB.appointment).getTime();
  });

  const counterColumn = (title: string, field: keyof Property): ColumnsType<Property>[number] => ({
    title,
    key: field,
    render: (_, property) => (
      <Space size="middle">
        <Tooltip title={`Disminuir ${title.toLowerCase()}`}>
          <Button
            icon={<MinusOutlined />}
            onClick={() => changeCounter(property, field, -1)}
            disabled={!property[field]}
          />
        </Tooltip>
        <span>{Number(property[field] ?? 0)}</span>
        <Tooltip title={`Aumentar ${title.toLowerCase()}`}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => changeCounter(property, field, 1)}
          />
        </Tooltip>
      </Space>
    ),
  });

  const columns: ColumnsType<Property> = [
  {
    title: 'Dirección',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Vendedor',
    dataIndex: 'seller',
    key: 'seller',
    render: (_, property) =>
      property.seller ? (
        <Link to={`/seller/${property.seller._id}`}>
          {property.seller.username}
        </Link>
      ) : (
        'No asignado'
      ),
  },
  counterColumn('Vistas Detalle', 'timesDetailView'),
  counterColumn('Veces Interesado', 'timesInterested'),
  counterColumn('Veces Listada', 'timesListed'),
  counterColumn('Veces Ofrecida', 'timesOffered'),
  {
    title: 'Veces Visitada',
    key: 'calculatedTimesVisited',
    render: (_, property) => (
      <span>{getTimesVisited(property._id!)}</span>
    ),
  },
  {
    title: 'Próxima Visita',
    key: 'nextVisit',
    render: (_, property) => {
      const nextVisit = getNextVisit(property._id!);
      return nextVisit ? (
        <Link to={`/visit/${nextVisit._id}`}>
          {new Date(nextVisit.appointment).toLocaleString()}
        </Link>
      ) : (
        'No hay visitas programadas'
      );
    },
  },
  {
    title: 'Última Visita',
    key: 'previousVisit',
    render: (_, property) => {
      const previousVisit = getPreviousVisit(property._id!);
      return previousVisit ? (
        <Link to={`/visit/${previousVisit._id}`}>
          {new Date(previousVisit.appointment).toLocaleString()}
        </Link>
      ) : (
        'No hay visitas anteriores'
      );
    },
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_, property) => (
      <Space size="middle">
        <Link to={`/property/${property._id}`}>
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
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Input
    placeholder="Buscar por dirección o vendedor"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
    style={{
      width: 320,
      height: 40,
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: 0,
    }}
  />

  <Button
    type="primary"
    style={{ height: 40, marginLeft: 16 }}
    onClick={() => navigate('/property/new')}
  >
    Crear Nueva Propiedad
  </Button>
</div>

      <Table
        columns={columns}
        dataSource={sortedProperties}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
};

export default PropertyPage;
