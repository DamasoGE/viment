import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSeller from '../hooks/useSeller'; // Importa el hook que has creado

interface Seller {
  username: string;
  dni: string;
}

const SellerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();


  const { sellers, loading, error } = useSeller();

  const [sellerFilter, setSellerFilter] = useState<Seller[]>([]);

  useEffect(() => {
    if (searchTerm) {

      const filtered = sellers.filter((seller) =>
        seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.dni.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSellerFilter(filtered);
    } else {
      setSellerFilter(sellers);
    }
  }, [searchTerm, sellers]);

  const columns = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link">
            Ver detalles
          </Button>
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Buscar por username o DNI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ width: 300, marginBottom: 20 }}
        />

        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => {
            navigate('/seller/new');
          }}
        >
          Crear Nuevo Vendedor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sellerFilter} 
        rowKey="dni"
      />
    </div>
  );
};

export default SellerPage;
