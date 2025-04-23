import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Result, Button, Spin, List, Typography } from 'antd';
import useProperty from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, loading } = useProperty();
  const { visits, loading: loadingVisits } = useVisit();

  const property = useMemo(() => {
    return properties.find((p) => p._id === id) || null;
  }, [properties, id]);

  const propertyVisits = useMemo(() => {
    return visits.filter((v) => v.property._id === id);
  }, [visits, id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Cargando propiedad..." />
      </div>
    );
  }

  if (!property) {
    return (
      <Result
        status="404"
        title="Propiedad no encontrada"
        subTitle="No pudimos encontrar una propiedad con ese ID."
        extra={
          <Button type="primary" href="/property">
            Volver al listado
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalles de la Propiedad</h1>

      <Card title="Información General" style={{ marginBottom: 24 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="Dirección">{property.address}</Descriptions.Item>
          <Descriptions.Item label="Vendedor">
            {property.seller ? (
              <Link to={`/seller/${property.seller._id}`}>
                {property.seller.username}
              </Link>
            ) : (
              'No asignado'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Veces Ofrecida">{property.timesOffered}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro">
            {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'No disponible'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Acciones" style={{ marginBottom: 24 }}>
        <p>(Aquí iría un historial o acciones adicionales relacionadas con la propiedad)</p>
      </Card>

      <Divider />
      
      <Card title="Visitas a esta propiedad">
        {loadingVisits ? (
          <Spin tip="Cargando visitas..." />
        ) : propertyVisits.length === 0 ? (
          <Typography.Text type="secondary">No hay visitas registradas.</Typography.Text>
        ) : (
          <List
            dataSource={propertyVisits}
            renderItem={(visit) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/visit/${visit._id}`}>
                    {new Date(visit.appointment).toLocaleString()}
                  </Link>
                }
                description={visit.comment || 'Sin comentario'}
              />
            </List.Item>
            )}
          />
        )}
      </Card>

      <div style={{ marginTop: 24 }}>
        <Button type="primary">
          <Link to="/property" style={{ color: 'inherit' }}>
            Volver a la lista de propiedades
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
