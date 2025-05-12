import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Popover, message, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import useProperty from '../hooks/useProperty';

const PropertyAdSection: React.FC<{ propertyAds: string[]; propertyId: string }> = ({ propertyAds, propertyId }) => {
    
    const [ads, setAds] = useState<string[]>([])
    const [newAdUrl, setNewAdUrl] = useState('');
    const [adUrlError, setAdUrlError] = useState<string | null>(null);
    const { updateProperty } = useProperty();

    useEffect(() => {
        setAds(propertyAds);
      }, [propertyAds]);

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
      return;
    }
  
    if (!propertyId) {
      message.error('Error: no se encontró la propiedad');
      return;
    }
  
    try {
      const updatedAds = [...ads, trimmedUrl];
      setAds(updatedAds);
      setNewAdUrl('');
      setAdUrlError(null);
      await updateProperty(propertyId, 'ads', updatedAds);
      message.success('Anuncio agregado');
    } catch {
      setAdUrlError('URL inválida.');
    }
  };

  const handleRemoveAd = async (urlToRemove: string) => {
    if (!propertyId) {
      message.error('Error: no se encontró la propiedad');
      return;
    }
  
    const updatedAds = ads.filter((url) => url !== urlToRemove);
    setAds(updatedAds);
    await updateProperty(propertyId, 'ads', updatedAds);
    message.success('Anuncio eliminado');
  };

  return (

    <>

<div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <Popover
              content={adUrlError}
              placement="topLeft"
              trigger="click"
            >
              <Input
                placeholder="Añadir nuevo anuncio (URL)"
                value={newAdUrl}
                onChange={(e) => {
                  setNewAdUrl(e.target.value);
                  setAdUrlError(null);
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
    </>

  );
};

export default PropertyAdSection;
