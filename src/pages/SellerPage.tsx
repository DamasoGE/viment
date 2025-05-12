import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useSeller, { Seller } from '../hooks/useSeller';
import { ColumnsType } from 'antd/es/table';
import { IoSearchCircleOutline } from 'react-icons/io5';

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

  const columns: ColumnsType<Seller> = [
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
      render: (_, seller) => (
        <Space size="middle">
          <Link to={`/seller/${seller._id}`}>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <Input
    placeholder="Buscar por username o DNI"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
    style={{
      width: 320,
      height: 40, // altura fija para alinear con el botón
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: 0,
    }}
  />

  <Button
    type="primary"
    style={{
      height: 40, // igual que el Input
      marginLeft: 16, // separación opcional
    }}
    onClick={() => navigate('/seller/new')}
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
