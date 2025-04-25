import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Result, Button, Spin, Form, Input, Menu, Dropdown, Tag } from 'antd';
import useVisit, { Visit } from '../hooks/useVisit'; // Asegúrate de importar el hook adecuado
import { EditOutlined } from '@ant-design/icons';

const VisitDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { visits, loading: visitLoading, updateVisit } = useVisit();
  const [submitting, setSubmitting] = useState(false);

  // Buscar la visita correspondiente
  const visit: Visit | null = useMemo(() => {
    return visits.find((v) => v._id === id) || null;
  }, [visits, id]);

  // Cambiar el estado de la visita
  const handleStatusChange = async (visitId: string, status: string) => {
    try {
      await updateVisit(visitId, "status", status);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Definir el menú de selección de estado
  const menu = (
    <Menu
    onClick={({ key }) => {
      if (visit) {
        handleStatusChange(visit._id, key);
      }
    }}
      items={[
        { key: 'pending', label: 'Pendiente' },
        { key: 'completed', label: 'Completada' },
        { key: 'cancelled', label: 'Cancelada' },
      ]}
    />
  );

  // Asignar un color al estado de la visita
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

  // Mapear los textos de los estados
  const statusTextMap: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  // Mostrar el loading mientras se obtienen los datos de la visita
  if (visitLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin tip="Cargando visita...">
          <div style={{ width: 200, height: 100 }} />
        </Spin>
      </div>
    );
  }

  // Mostrar error si no se encuentra la visita
  if (!visit) {
    return (
      <Result
        status="404"
        title="Visita no encontrada"
        subTitle="No pudimos encontrar una visita con ese ID."
        extra={
          <Button type="primary" href="/visit">
            Volver al listado de visitas
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Información de la Visita</h1>

      {/* Sección 1: Información de la Visita */}
      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Fecha de la Cita">
            {new Date(visit.appointment).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="Propiedad">
            {visit.property ? (
              <Link to={`/property/${visit.property._id}`}>
                {visit.property.address}
              </Link>
            ) : (
              'Propiedad no disponible'
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Estado">
              <Tag color={getStatusColor(visit.status)}>
                {statusTextMap[visit.status]}
              </Tag>
            <Dropdown overlay={menu} trigger={['click']}>
              <EditOutlined />
            </Dropdown>

          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      {/* Sección 2: Comentario */}
      <Card title="Comentario">
        {visit.comment ? (
          <p><strong>Comentario actual:</strong> {visit.comment}</p>
        ) : (
          <p style={{ color: '#888' }}>No hay comentario aún.</p>
        )}

        <Form
          layout="vertical"
          onFinish={async (values) => {
            try {
              setSubmitting(true);
              await updateVisit(id!, 'comment', values.comment); // Función del hook
            } catch (error) {
              console.error('Error al actualizar comentario:', error);
            } finally {
              setSubmitting(false);
            }
          }}
          initialValues={{ comment: visit.comment || '' }}
        >
          <Form.Item
            label="Editar comentario"
            name="comment"
            rules={[{ message: 'El comentario no puede estar vacío.' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {visit.comment ? 'Actualizar Comentario' : 'Agregar Comentario'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Button type="primary">
        <Link to="/visit" style={{ color: 'inherit' }}>
          Volver a la lista de visitas
        </Link>
      </Button>
    </div>
  );
};

export default VisitDetailsPage;
