import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Result, Button, Spin, Divider, Popconfirm, message } from 'antd';
import useAsesor, { Asesor } from '../hooks/useAsesor';

const AsesorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchAsesorById, loading, deleteAsesor, user } = useAsesor(); // <-- obtener user logueado
  const [asesor, setAsesor] = useState<Asesor | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const aux = async () => {
      if (id) {
        const asesorfetch = await fetchAsesorById(id);
        setAsesor(asesorfetch);
      }
    };
    aux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const success = await deleteAsesor(id);
    setDeleting(false);
    if (success) {
      message.success('Asesor eliminado correctamente');
      navigate('/asesor');
    } else {
      message.error('Error al eliminar el asesor');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Cargando información del asesor..." />
      </div>
    );
  }

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

  // Validamos si es el usuario logueado para evitar borrar a sí mismo
  const isSelf = user?._id === id;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Detalles del Asesor</h1>

        {!isSelf && (
          <Popconfirm
            title="¿Estás seguro de eliminar este asesor?"
            onConfirm={confirmDelete}
            okText="Sí"
            cancelText="No"
            disabled={deleting}
          >
            <Button type="primary" danger loading={deleting}>
              Borrar Asesor
            </Button>
          </Popconfirm>
        )}
      </div>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Nombre de Usuario">{asesor.username}</Descriptions.Item>
          <Descriptions.Item label="Administrador">{asesor.admin ? 'Sí' : 'No'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Button type="primary">
        <Link to="/asesor" style={{ color: 'inherit' }}>
          Volver a la lista de asesores
        </Link>
      </Button>
    </div>
  );
};

export default AsesorDetailsPage;
