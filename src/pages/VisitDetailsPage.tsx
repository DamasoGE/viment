import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Result, Button, Spin, Form, Input } from 'antd';
import useVisit from '../hooks/useVisit'; // Asegúrate de importar el hook adecuado

const VisitDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { visits, loading: visitLoading, updateVisit } = useVisit();
  const [submitting, setSubmitting] = useState(false);

  const visit = useMemo(() => {
    return visits.find((v) => v._id === id) || null;
  }, [visits, id]);

  if (visitLoading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
          <Spin tip="Cargando visita...">
            <div style={{ width: 200, height: 100 }} />
          </Spin>
        </div>
      );
  }

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
      <h1>Detalles de la Visita</h1>

      {/* Sección 1: Información de la Visita */}
      <Card title="Información General" style={{ marginBottom: 24 }}>
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
        </Descriptions>
      </Card>

      <Divider />

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
            await updateVisit(id!, 'comment' , values.comment); // función del hook

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
        rules={[{ required: true, message: 'El comentario no puede estar vacío.' }]}
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

      {/* Sección 2: Acciones o Historial */}
      <Card title="Acciones" style={{ marginBottom: 24 }}>
        <p>(Aquí irían acciones adicionales relacionadas con la visita, como historial de visitas o comentarios)</p>
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
