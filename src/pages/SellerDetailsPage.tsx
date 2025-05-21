import React, { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Divider,
  Result,
  Button,
  List,
  Spin,
  message,
  Popconfirm,
} from 'antd';
import useSeller from '../hooks/useSeller';
import useProperty from '../hooks/useProperty';

const SellerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sellers, loading: loadingSellers, deleteSeller } = useSeller();
  const { properties, loading: loadingProperties } = useProperty();

  const seller = useMemo(
    () => sellers.find((s) => s._id === id) || null,
    [sellers, id]
  );

  const sellerProperties = useMemo(
    () => properties.filter((p) => p.seller?._id === id),
    [properties, id]
  );

  const handleDelete = async () => {
    if (!id) return;

    const success = await deleteSeller(id);

    if(success){
      message.success('Vendedor borrado correctamente');
      navigate('/seller');
    }else{
    message.error('No se pudo borrar el vendedor');
    }

  };

  if (loadingSellers || loadingProperties) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Cargando información del vendedor..." />
      </div>
    );
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
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
      </div>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre de Usuario">{seller.username}</Descriptions.Item>
          <Descriptions.Item label="DNI">{seller.dni}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro">
            {seller.createdAt
              ? new Date(seller.createdAt).toLocaleDateString()
              : 'No disponible'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Propiedades del Vendedor">
        {sellerProperties.length === 0 ? (
          <p>Este vendedor no tiene propiedades registradas.</p>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={sellerProperties}
            renderItem={(property) => (
              <List.Item
                actions={[
                  <Link to={`/property/${property._id}`} key="ver">
                    Ver Detalles
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={property.address}
                  description={`Veces ofrecida: ${property.timesOffered}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Divider />

      <Button type="primary">
        <Link to="/seller" style={{ color: 'inherit' }}>
          Volver a la lista de vendedores
        </Link>
      </Button>
    </div>
  );
};

export default SellerDetailsPage;
