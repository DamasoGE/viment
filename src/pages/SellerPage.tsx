import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Switch, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useSeller, { Seller } from '../hooks/useSeller';
import { ColumnsType } from 'antd/es/table';
import { IoSearchCircleOutline } from 'react-icons/io5';
import { SettingOutlined } from '@ant-design/icons';
import { ContainerFlex, HeaderPageContainer, InputDiv } from '../styles/theme';
import CenteredSpin from '../components/CenteredSpin';

const SellerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRequireAsesor, setFilterRequireAsesor] = useState<boolean>(false);
  const navigate = useNavigate();

  const { sellers, loading, toggleRequireAsesor, fetchSellers } = useSeller();
  const [sellerFilter, setSellerFilter] = useState<Seller[]>([]);

  useEffect(() => {
    const init = async () => {
      await fetchSellers();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = sellers;

    if (searchTerm) {
      filtered = filtered.filter((seller) =>
        seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.dni.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRequireAsesor) {
      filtered = filtered.filter((seller) => seller.requireAsesor);
    }

    setSellerFilter(filtered);
  }, [searchTerm, filterRequireAsesor, sellers]);

  const columns: ColumnsType<Seller> = [
    {
      title: 'Acciones',
      width: 100,
      align: 'center',
      key: 'actions',
      render: (_, seller) => (
        <Space>
          <Link to={`/seller/${seller._id}`}>
            <SettingOutlined style={{ color: 'black', fontSize: '18px' }} />
          </Link>
        </Space>
      ),
    },
    {
      title: 'Requiere Asesor',
      width: 100,
      key: 'requireAsesor',
      align: 'center',
      render: (_, seller) => (
        <Switch
          checked={seller.requireAsesor}
          onChange={() => toggleRequireAsesor(seller._id!)}
        />
      ),
    },
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
  ];

  if (loading) {
    return <CenteredSpin tipText="Cargando Vendedores..." />;
  }

  return (
    <>
      <HeaderPageContainer style={{ flexWrap: 'wrap', gap: 12 }}>
        <ContainerFlex>
          <Input
            placeholder="Buscar por username o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
            style={{ width: 320 }}
          />

          <InputDiv>
            <span>Requiere asesor:</span>
            <Switch
              checked={filterRequireAsesor}
              onChange={(checked) => setFilterRequireAsesor(checked)}
              style={{ marginLeft: 12 }}
            />
          </InputDiv>
        </ContainerFlex>

        <Button
          type="primary"
          style={{ height: 40 }}
          onClick={() => navigate('/seller/new')}
        >
          Crear Nuevo Vendedor
        </Button>
      </HeaderPageContainer>

      <Table 
        columns={columns} 
        dataSource={sellerFilter} 
        rowKey="_id" 
        locale={{
          emptyText: <Empty description="No hay datos para ese filtro" />,
        }}
        />
    </>
  );
};

export default SellerPage;
