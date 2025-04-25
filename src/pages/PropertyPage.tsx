import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Tooltip, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useProperty, { Property } from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const PropertyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const { properties, loading, error, updateProperty } = useProperty();
  const { visits } = useVisit(); // Asegúrate de tener acceso a las visitas

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

  // Funciones para incrementar y decrementar "Veces Ofrecida"
  const incrementTimesOffered = async (property: Property) => {
    const newTimesOffered = property.timesOffered ? property.timesOffered + 1 : 1;
    await updateProperty(property._id!, 'timesOffered', newTimesOffered.toString());
  };

  const decrementTimesOffered = async (property: Property) => {
    if (property.timesOffered && property.timesOffered > 0) {
      const newTimesOffered = property.timesOffered - 1;
      await updateProperty(property._id!, 'timesOffered', newTimesOffered.toString());
    }
  };

  // Función para obtener la próxima visita de una propiedad
  const getNextVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    const upcomingVisit = propertyVisits
      .filter((visit) => new Date(visit.appointment) > new Date()) // Filtrar visitas futuras
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime())[0]; // Ordenar por la más cercana
    return upcomingVisit;
  };

  // Función para obtener la anterior visita de una propiedad
  const getPreviousVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    const previousVisit = propertyVisits
      .filter((visit) => new Date(visit.appointment) < new Date()) // Filtrar visitas pasadas
      .sort((a, b) => new Date(b.appointment).getTime() - new Date(a.appointment).getTime())[0]; // Ordenar por la más reciente
    return previousVisit;
  };

  // Ordenar las propiedades por la próxima visita (de más cercana a más lejana)
  const sortedProperties = propertyFilter.sort((a, b) => {
    const nextVisitA = getNextVisit(a._id!);
    const nextVisitB = getNextVisit(b._id!);
    if (!nextVisitA) return 1;
    if (!nextVisitB) return -1;
    return new Date(nextVisitA.appointment).getTime() - new Date(nextVisitB.appointment).getTime();
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
      render: (_, property) => (
        property.seller ? (
          <Link to={`/seller/${property.seller._id}`}>
            {property.seller.username}
          </Link>
        ) : (
          'No asignado'
        )
      ),
    },
    {
      title: 'Veces Ofrecida',
      dataIndex: 'timesOffered',
      key: 'timesOffered',
      render: (_, property) => (
        <Space size="middle">
          <Tooltip title="Disminuir veces ofrecida">
            <Button
              icon={<MinusOutlined />}
              onClick={() => decrementTimesOffered(property)}
              disabled={property.timesOffered === 0}
            />
          </Tooltip>
          <span>{property.timesOffered}</span>
          <Tooltip title="Aumentar veces ofrecida">
            <Button
              icon={<PlusOutlined />}
              onClick={() => incrementTimesOffered(property)}
            />
          </Tooltip>
        </Space>
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
  ) 
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Buscar por dirección o vendedor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 20 }}
        />

        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => {
            navigate('/property/new');
          }}
        >
          Crear Nueva Propiedad
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sortedProperties}
        rowKey="_id"
      />
    </div>
  );
};

export default PropertyPage;
