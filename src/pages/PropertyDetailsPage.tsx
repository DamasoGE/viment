import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Divider,
  Result,
  Button,
  Spin,
  Typography,
  Collapse,
  message,
  Popconfirm
} from 'antd';
import useProperty from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import PropertyAdSection from '../components/PropertyAdSection';
import PropertyVisitSection from '../components/PropertyVisitSection';
import PropertyDocumentSection from '../components/PropertyDocumentSection';
import { useNavigate } from 'react-router-dom';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, loading, updateProperty, deleteProperty } = useProperty();
  const navigate = useNavigate();
  const { visits, loading: loadingVisits } = useVisit();

  const property = useMemo(() => {
    return properties.find((p) => p._id === id) || null;
  }, [properties, id]);

  const propertyVisits = useMemo(() => {
    
    return visits
      .filter((v) => v.property._id === id)
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime());
  }, [visits, id]);

const handleDeleteProperty = async () => {
  if (!property?._id) return;

  try {
    const success = await deleteProperty(property._id);
    if (success) {
      message.success("Propiedad eliminada correctamente");
      navigate("/property");
    } else {
      message.error("No se pudo eliminar la propiedad");
    }
  } catch (err) {
    console.error("Error al eliminar la propiedad:", err);
    message.error("Ocurrió un error al intentar eliminar la propiedad");
  }
};

  // States
  const [timesOffered, setTimesOffered] = useState<number>(property?.timesOffered || 0);
  const [timesListed, setTimesListed] = useState<number>(property?.timesListed || 0);
  const [timesInterested, setTimesInterested] = useState<number>(property?.timesInterested || 0);
  const [timesDetailView, setTimesDetailView] = useState<number>(property?.timesDetailView || 0);
  const [ads, setAds] = useState<string[]>(property?.ads || []);

  // Sync on property change
  useEffect(() => {
    if (property) {
      setTimesOffered(property.timesOffered || 0);
      setTimesListed(property.timesListed || 0);
      setTimesInterested(property.timesInterested || 0);
      setTimesDetailView(property.timesDetailView || 0);
      setAds(property.ads || []);
    }
  }, [property]);

  // Método general para cambiar contadores
  const changeCounter = async (field: string, value: number, setValue: React.Dispatch<React.SetStateAction<number>>) => {
    if (!property?._id) return;
    const newValue = Math.max(0, value);
    setValue(newValue);
    await updateProperty(property._id, field, newValue.toString());
  };

  // Visitas completadas
  const getTimesVisited = (): number => {
    return visits.filter(v => v.property._id === id && v.status === 'completed').length;
  };

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
      
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <h1 style={{ margin: 0 }}>Información de la propiedad</h1>
      <Popconfirm
        title="¿Estás seguro de borrar esta propiedad? Se eliminarán también las visitas asociadas"
        onConfirm={handleDeleteProperty}
        okText="Sí"
        cancelText="No"
      >
        <Button type="primary" danger>
          Borrar Propiedad
        </Button>
      </Popconfirm>
    </div>

  <Card>
    <Descriptions column={1}>
      <Descriptions.Item label="Dirección">{property.address}</Descriptions.Item>

      <Descriptions.Item label="Vendedor">
        {property.seller ? (
          <Link to={`/seller/${property.seller._id}`}>{property.seller.username}</Link>
        ) : (
          'No asignado'
        )}
      </Descriptions.Item>

      {/* Veces Detalle */}
      <Descriptions.Item label="Vistas Detalle">
        <Button
          icon={<MinusOutlined />}
          onClick={() => changeCounter('timesDetailView', timesDetailView - 1, setTimesDetailView)}
          style={{ marginRight: 8, height: '20px' }}
          disabled={timesDetailView <= 0}
        />
        {timesDetailView}
        <Button
          icon={<PlusOutlined />}
          onClick={() => changeCounter('timesDetailView', timesDetailView + 1, setTimesDetailView)}
          style={{ marginLeft: 8, height: '20px' }}
        />
      </Descriptions.Item>

      {/* Veces Interesado */}
      <Descriptions.Item label="Veces Interesado">
        <Button
          icon={<MinusOutlined />}
          onClick={() => changeCounter('timesInterested', timesInterested - 1, setTimesInterested)}
          style={{ marginRight: 8, height: '20px' }}
          disabled={timesInterested <= 0}
        />
        {timesInterested}
        <Button
          icon={<PlusOutlined />}
          onClick={() => changeCounter('timesInterested', timesInterested + 1, setTimesInterested)}
          style={{ marginLeft: 8, height: '20px' }}
        />
      </Descriptions.Item>

      {/* Veces Listada */}
      <Descriptions.Item label="Veces Listada">
        <Button
          icon={<MinusOutlined />}
          onClick={() => changeCounter('timesListed', timesListed - 1, setTimesListed)}
          style={{ marginRight: 8, height: '20px' }}
          disabled={timesListed <= 0}
        />
        {timesListed}
        <Button
          icon={<PlusOutlined />}
          onClick={() => changeCounter('timesListed', timesListed + 1, setTimesListed)}
          style={{ marginLeft: 8, height: '20px' }}
        />
      </Descriptions.Item>

      {/* Veces Ofrecida */}
      <Descriptions.Item label="Veces Ofrecida">
        <Button
          icon={<MinusOutlined />}
          onClick={() => changeCounter('timesOffered', timesOffered - 1, setTimesOffered)}
          style={{ marginRight: 8, height: '20px' }}
          disabled={timesOffered <= 0}
        />
        {timesOffered}
        <Button
          icon={<PlusOutlined />}
          onClick={() => changeCounter('timesOffered', timesOffered + 1, setTimesOffered)}
          style={{ marginLeft: 8, height: '20px' }}
        />
      </Descriptions.Item>

      {/* Veces Visitada (solo lectura) */}
      <Descriptions.Item label="Veces Visitada">
        {getTimesVisited()}
      </Descriptions.Item>

      {/* Fecha de registro */}
      <Descriptions.Item label="Fecha de Registro">
        {property.createdAt
          ? new Date(property.createdAt).toLocaleDateString()
          : 'No disponible'}
      </Descriptions.Item>
    </Descriptions>
  </Card>


      <Divider />

      <Collapse accordion={false}>
        <Collapse.Panel header="Anuncios (Ads)" key="2">
          <PropertyAdSection
            propertyAds={ads}
            propertyId={property._id as string}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Visitas a esta propiedad" key="3">
          {loadingVisits ? (
            <Spin tip="Cargando visitas..." />
          ) : propertyVisits.length === 0 ? (
            <Typography.Text type="secondary">No hay visitas registradas.</Typography.Text>
          ) : (
            <PropertyVisitSection
              propertyVisits={propertyVisits}
              propertyId={property._id as string}
            />
          )}
        </Collapse.Panel>

        <Collapse.Panel header="Documentos del Asesor" key="4">
          <PropertyDocumentSection
            propertyId={property._id as string}
          />
        </Collapse.Panel>
      </Collapse>

      <Button type="primary" style={{ marginTop: 24 }}>
        <Link to="/property" style={{ color: 'inherit' }}>
          Volver a la lista de propiedades
        </Link>
      </Button>
    </div>
  );
};

export default PropertyDetailsPage;
