import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Descriptions, Result, Button, Spin, Divider } from 'antd';
import useAsesor, { Asesor } from '../hooks/useAsesor';

const AsesorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAsesorById, loading } = useAsesor();
  const [asesor, setAsesor] = useState<Asesor | null>(null);

  useEffect(() => {
    const aux = async () => {
        if (id){
            const asesorfetch = await fetchAsesorById(id);
            setAsesor(asesorfetch);
        }
    }
    aux();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  




  // Si estamos cargando los datos de los asesores o las propiedades, mostrar un spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Cargando información del asesor..." />
      </div>
    );
  }

  // Si no se encuentra el asesor, mostrar un mensaje de error
  if (!asesor) {
    return (
      <Result
        status="404"
        title="Asesor no encontrado"
        subTitle="No pudimos encontrar un asesor con ese ID."
        extra={<Button type="primary" href="/asesor">Volver al listado</Button>}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalles del Asesor</h1>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre de Usuario">{asesor.username}</Descriptions.Item>
          <Descriptions.Item label="Administrador">{asesor.admin ? 'Sí' : 'No'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider/>

      <Button type="primary">
        <Link to="/asesor" style={{ color: 'inherit' }}>
          Volver a la lista de asesores
        </Link>
      </Button>
    </div>
  );
};

export default AsesorDetailsPage;
