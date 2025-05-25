import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAsesor from '../hooks/useAsesor';

const { Title } = Typography;

const NewAsesorPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { Text } = Typography;

  const { createAsesor } = useAsesor();

  const onFinish = async (values: { username: string }) => {
    setLoading(true);
    try {
      await createAsesor(values.username);
      message.success('Asesor creado con éxito');
      navigate('/asesor');
    } catch (error) {
      message.error('Error al crear el asesor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>Añadir Nuevo Asesor</Title>
      <Form
        name="newAsesor"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ username: '' }}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <Form.Item
          label="Nombre de Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa el nombre de usuario' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Crear Asesor
          </Button>
        </Form.Item>

        <Text type="secondary">
          La contraseña por defecto será la misma que el Nombre de usuario
        </Text>
      </Form>


    </>
  );
};

export default NewAsesorPage;
