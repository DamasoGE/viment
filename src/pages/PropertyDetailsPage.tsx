import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Divider,
  Result,
  Button,
  Spin,
  List,
  Typography,
  Tag,
  Table,
  Input,
  message,
  Popover,
  Collapse,
} from 'antd';
import useProperty from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, loading, updateProperty } = useProperty();
  const { visits, loading: loadingVisits } = useVisit();

  const property = useMemo(() => {
    return properties.find((p) => p._id === id) || null;
  }, [properties, id]);

  const propertyVisits = useMemo(() => {
    return visits
      .filter((v) => v.property._id === id)
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime());
  }, [visits, id]);

  const [timesOffered, setTimesOffered] = useState<number>(property?.timesOffered || 0);
  const [ads, setAds] = useState<string[]>(property?.ads || []);
  const [newAdUrl, setNewAdUrl] = useState('');
  const [adUrlError, setAdUrlError] = useState<string | null>(null);
  const [popoverVisible, setPopoverVisible] = useState(false);

  useEffect(() => {
    if (property) {
      setTimesOffered(property.timesOffered || 0);
      setAds(property.ads || []);
    }
  }, [property]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'gold';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const statusTextMap: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  const handleIncreaseTimesOffered = async () => {
    if (property?._id) {
      const updatedTimesOffered = timesOffered + 1;
      setTimesOffered(updatedTimesOffered);
      await updateProperty(property._id, 'timesOffered', updatedTimesOffered);
    }
  };

  const handleDecreaseTimesOffered = async () => {
    if (timesOffered > 0 && property?._id) {
      const updatedTimesOffered = timesOffered - 1;
      setTimesOffered(updatedTimesOffered);
      await updateProperty(property._id, 'timesOffered', updatedTimesOffered);
    }
  };

  const getPlatformFromUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', '');
    } catch {
      return 'Plataforma desconocida';
    }
  };

  const handleAddAd = async () => {
    const trimmedUrl = newAdUrl.trim();
  
    const isValidFormat = /^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(trimmedUrl);
    if (!isValidFormat) {
      setAdUrlError('La URL debe comenzar con http:// o https:// y tener un dominio válido.');
      setPopoverVisible(true);
      return;
    }
  
    if (!property?._id) {
      message.error('Error: no se encontró la propiedad');
      return;
    }
  
    try {
      const updatedAds = [...ads, trimmedUrl];
      setAds(updatedAds);
      setNewAdUrl('');
      setAdUrlError(null);
      setPopoverVisible(false);
      await updateProperty(property._id, 'ads', updatedAds);
      message.success('Anuncio agregado');
    } catch {
      setAdUrlError('URL inválida.');
      setPopoverVisible(true);
    }
  };
  
  const handleRemoveAd = async (urlToRemove: string) => {
    if (!property?._id) {
      message.error('Error: no se encontró la propiedad');
      return;
    }
  
    const updatedAds = ads.filter((url) => url !== urlToRemove);
    setAds(updatedAds);
    await updateProperty(property._id, 'ads', updatedAds);
    message.success('Anuncio eliminado');
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

      <h1>Información de la propiedad</h1>

      <Card>
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
          <Descriptions.Item label="Veces Ofrecida">
            <Button
              icon={<MinusOutlined />}
              onClick={handleDecreaseTimesOffered}
              style={{ marginRight: 8, height: '20px' }}
              disabled={timesOffered <= 0}
            />
            {timesOffered}
            <Button
              icon={<PlusOutlined />}
              onClick={handleIncreaseTimesOffered}
              style={{ marginLeft: 8, height: '20px' }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro">
            {property.createdAt
              ? new Date(property.createdAt).toLocaleDateString()
              : 'No disponible'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Collapse defaultActiveKey={['2', '3']} accordion>
        <Collapse.Panel header="Anuncios (Ads)" key="2">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <Popover
              content={adUrlError}
              visible={popoverVisible}
              placement="topLeft"
              trigger="click"
            >
              <Input
                placeholder="Añadir nuevo anuncio (URL)"
                value={newAdUrl}
                onChange={(e) => {
                  setNewAdUrl(e.target.value);
                  setAdUrlError(null);
                  setPopoverVisible(false);
                }}
                style={{ marginRight: 8 }}
                status={adUrlError ? 'error' : undefined}
              />
            </Popover>
            <Button type="primary" onClick={handleAddAd}>
              Añadir
            </Button>
          </div>

          {ads.length === 0 ? (
            <Typography.Text type="secondary">No hay anuncios disponibles.</Typography.Text>
          ) : (
            <Table
              dataSource={ads.map((url, index) => ({
                key: index,
                platform: getPlatformFromUrl(url),
                url,
              }))}
              columns={[
                {
                  title: 'Plataforma',
                  dataIndex: 'platform',
                  key: 'platform',
                },
                {
                  title: 'Enlace',
                  dataIndex: 'url',
                  key: 'url',
                  render: (url) => (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  ),
                },
                {
                  title: 'Acciones',
                  key: 'actions',
                  render: (_, record) => (
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveAd(record.url)}
                    >
                      Eliminar
                    </Button>
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
          )}
        </Collapse.Panel>

        <Collapse.Panel header="Visitas a esta propiedad" key="3">
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
                        <Tag color={getStatusColor(visit.status)}>{statusTextMap[visit.status]}</Tag>
                        {new Date(visit.appointment).toLocaleString()}
                      </Link>
                    }
                    description={
                      <div style={{ paddingLeft: '20px' }}>
                        {visit.comment || 'Sin comentario'}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
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
