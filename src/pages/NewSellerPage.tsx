import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSeller from '../hooks/useSeller'; // Asegúrate de importar el hook

const NewSellerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Obtener la función createSeller del hook useSeller
  const { createSeller } = useSeller();

  const onFinish = async (values: { username: string; dni: string }) => {
    setLoading(true);
    try {
      await createSeller(values);
      message.success('Seller creado con éxito');
      navigate('/seller');
    } catch (error) {
      message.error('Error al crear el seller');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Añadir Nuevo Vendedor</h2>
      <Form
        name="newSeller"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ username: '', dni: '' }}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <Form.Item
          label="Nombre de Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa el nombre de usuario!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="DNI"
          name="dni"
          rules={[{ required: true, message: 'Por favor ingresa el DNI!' }]}
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
            Crear Vendedor
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewSellerPage;
