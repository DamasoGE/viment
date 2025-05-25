import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAsesor from '../hooks/useAsesor';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAsesor();
  const navigate = useNavigate();

  const { updateAsesor } = useAsesor();

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
        if (user?._id) {
            await updateAsesor(user._id, { password: values.newPassword });
          } else {
            message.error('No se encontró el usuario');
          }
      message.success('Contraseña cambiada con éxito');
      navigate('/');
    } catch (error) {
      message.error('Error al cambiar la contraseña');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Cambiar Contraseña</h2>
      <Form
        name="changePassword"
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 400, margin: 'auto' }}
      >

        <Form.Item
          label="Nueva Contraseña"
          name="newPassword"
          rules={[{ required: true, message: 'Por favor ingresa una nueva contraseña!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          rules={[{ required: true, message: 'Por favor confirma tu nueva contraseña!' }]}
          validateStatus={errorMessage ? 'error' : 'success'}
          help={errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Cambiar Contraseña
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProfilePage;
