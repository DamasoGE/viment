import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAsesor from '../hooks/useAsesor';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, fetchProfile } = useAsesor();
  const navigate = useNavigate();

  const { changePassword } = useAsesor();


useEffect(() => {
  const fetchData = async () => {
    await fetchProfile();
  };

  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  

    const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    if (!user?._id) {
      message.error('User not found');
      setLoading(false);
      return;
    }

    const success = await changePassword(user._id, values.newPassword);

    if (success) {
      message.success('Password changed successfully');
      navigate('/');
    } else {
      message.error('Failed to update password');
    }

    setLoading(false);
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
