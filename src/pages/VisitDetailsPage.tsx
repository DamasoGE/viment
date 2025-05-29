import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Divider,
  Result,
  Button,
  Form,
  Input,
  Menu,
  Dropdown,
  Tag,
  Popconfirm,
  message
} from 'antd';
import useVisit, { Visit } from '../hooks/useVisit';
import { EditOutlined } from '@ant-design/icons';
import { HeaderPageContainer } from '../styles/theme';
import { getStatusColor, statusTextMap } from '../helpers/status';
import CenteredSpin from '../components/CenteredSpin';

const VisitDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, fetchVisitById, updateVisit, deleteVisit } = useVisit();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const aux = async () => {
      if (id) {
        const visitFetch = await fetchVisitById(id);
        setVisit(visitFetch);
      }
    };
    aux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (visitId: string, status: string) => {
    try {
      await updateVisit(visitId, "status", status);
      setVisit((prev) =>
        prev ? { ...prev, status: status as Visit['status'] } : prev
      );
      message.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      message.error('No se pudo actualizar el estado');
    }
  };

  const handleCommentChange = async (values: { comment: string }) => {
    if (!visit) return;
    try {
      setSubmitting(true);
      await updateVisit(visit._id, 'comment', values.comment);
      setVisit((prev) => prev ? { ...prev, comment: values.comment } : prev);
      message.success('Comentario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      message.error('No se pudo actualizar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const deleted = await deleteVisit(id);
    if (deleted) {
      message.success('Visita eliminada correctamente');
      navigate('/visit');
    } else {
      message.error('No se pudo eliminar la visita');
    }
  };

  const menuItems = Object.entries(statusTextMap).map(([key, label]) => ({
    key,
    label,
  }));

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (visit) {
          handleStatusChange(visit._id, key);
        }
      }}
      items={menuItems}
    />
  );

  if (loading) {
    return <CenteredSpin tipText="Cargando Visita..." />;
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
    <>
      <HeaderPageContainer>
        <h1 style={{ margin: 0 }}>Información de la Visita</h1>
        <Popconfirm
          title="¿Estás seguro de eliminar esta visita?"
          onConfirm={handleDelete}
          okText="Sí"
          cancelText="No"
        >
          <Button type="primary" danger>
            Borrar Visita
          </Button>
        </Popconfirm>
      </HeaderPageContainer>

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
              <EditOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
            </Dropdown>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Comentario">
        {visit.comment ? (
          <p>
            <strong>Comentario actual:</strong> {visit.comment}
          </p>
        ) : (
          <p style={{ color: '#888' }}>No hay comentario aún.</p>
        )}

        <Form
          layout="vertical"
          onFinish={handleCommentChange}
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

      <Button type="primary">
        <Link to="/visit" style={{ color: 'inherit' }}>
          Volver a la lista de visitas
        </Link>
      </Button>
    </>
  );
};

export default VisitDetailsPage;
