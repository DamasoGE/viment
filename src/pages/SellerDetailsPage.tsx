import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Divider,
  Result,
  Button,
  message,
  Popconfirm,
  Switch,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import useSeller, { Seller } from '../hooks/useSeller';
import { HeaderPageContainer } from '../styles/theme';
import CenteredSpin from '../components/CenteredSpin';

const SellerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchSellerById, deleteSeller, toggleRequireAsesor, loading } = useSeller();

  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    const aux = async () => {
      if (id) {
        const sellerfetch = await fetchSellerById(id);
        setSeller(sellerfetch);
      }
    };
    aux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const success = await deleteSeller(id);

    if (success) {
      message.success('Vendedor borrado correctamente');
      navigate('/seller');
    } else {
      message.error('No se pudo borrar el vendedor');
    }
  };

  const handleToggleRequireAsesor = async () => {
    if (!id) return;
    try {
      await toggleRequireAsesor(id);
      setSeller((prev) =>
        prev ? { ...prev, requireAsesor: !prev.requireAsesor } : prev
      );
      message.success('Requiere asesor actualizado');
    } catch {
      message.error('Error al actualizar requiere asesor');
    }
  };

  if (loading) {
    return <CenteredSpin tipText="Cargando Vendedor" />;
  }

  if (!seller) {
    return (
      <Result
        status="404"
        title="Cliente no encontrado"
        subTitle="No pudimos encontrar un vendedor con ese ID."
        extra={
          <Button type="primary" href="/seller">
            Volver al listado
          </Button>
        }
      />
    );
  }

  return (
    <>
      <HeaderPageContainer>
        <h1 style={{ margin: 0 }}>Información del Vendedor</h1>
        <Popconfirm
          title="¿Estás seguro de borrar este vendedor? Se borrarán también sus propiedades y visitas"
          onConfirm={handleDelete}
          okText="Sí"
          cancelText="No"
        >
          <Button type="primary" danger>
            Borrar Vendedor
          </Button>
        </Popconfirm>
      </HeaderPageContainer>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre de Usuario">{seller.username}</Descriptions.Item>
          <Descriptions.Item label="DNI">{seller.dni}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro">
            {seller.createdAt
              ? new Date(seller.createdAt).toLocaleDateString()
              : 'No disponible'}
          </Descriptions.Item>
          <Descriptions.Item label="Requiere Asesor">
            <Switch
              checked={seller.requireAsesor}
              onChange={handleToggleRequireAsesor}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Propiedades del Vendedor">
        {seller.properties?.length === 0 ? (
          <p>Este vendedor no tiene propiedades registradas.</p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'start',
            }}
          >
            {seller.properties?.map((property) => (
          <Card
            key={property._id}
            hoverable
            onMouseEnter={(e) => {
              const card = e.currentTarget as HTMLDivElement;
              card.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget as HTMLDivElement;
              card.style.boxShadow = "none";
            }}
            onClick={() => navigate(`/property/${property._id}`)}
            styles={{ body: { display: "flex", alignItems: "center", gap: 12 }}}
            style={{ backgroundColor: "#fafafa" }}
          >
          <HomeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{property.address}</div>
          </div>
        </Card>
              ))}
            </div>
          )}
        </Card>

      <Divider />

      <Button type="primary">
        <Link to="/seller" style={{ color: 'inherit' }}>
          Volver a la lista de vendedores
        </Link>
      </Button>
    </>
  );
};

export default SellerDetailsPage;
