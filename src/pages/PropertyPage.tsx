import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useProperty, { Property } from '../hooks/useProperty'; // Importa el hook para propiedades
import { ColumnsType } from 'antd/es/table';

const PropertyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const { properties, loading, error } = useProperty(); // Hook que obtiene las propiedades

  const [propertyFilter, setPropertyFilter] = useState<Property[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter((property) =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.seller?.username?.toLowerCase().includes(searchTerm.toLowerCase())) // Filtrar por vendedor
      );
      setPropertyFilter(filtered);
    } else {
      setPropertyFilter(properties);
    }
  }, [searchTerm, properties]);

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
      )
    },
    {
      title: 'Veces Ofrecida',
      dataIndex: 'timesOffered',
      key: 'timesOffered',
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
    return <div>Loading...</div>;
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
        dataSource={propertyFilter}
        rowKey="_id"
      />
    </div>
  );
};

export default PropertyPage;