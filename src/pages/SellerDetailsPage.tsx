import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Result, Button, List, Spin } from 'antd';
import useSeller from '../hooks/useSeller';
import useProperty from '../hooks/useProperty';

const SellerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sellers, loading: loadingSellers } = useSeller();
  const { properties, loading: loadingProperties } = useProperty();

  const seller = useMemo(() => sellers.find((s) => s._id === id) || null, [sellers, id]);

  const sellerProperties = useMemo(
    () => properties.filter((p) => p.seller?._id === id),
    [properties, id]
  );

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
        extra={<Button type="primary" href="/seller">Volver al listado</Button>}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Información del Vendedor</h1>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre de Usuario">{seller.username}</Descriptions.Item>
          <Descriptions.Item label="DNI">{seller.dni}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro">
            {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'No disponible'}
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
