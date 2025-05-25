import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSeller from '../hooks/useSeller';
import useProperty from '../hooks/useProperty';

const { Option } = Select;

const NewPropertyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { sellers } = useSeller();
  const { createProperty } = useProperty();

  const onFinish = async (values: { address: string; sellerId: string }) => {
    setLoading(true);
    try {
      await createProperty(values.address, values.sellerId);
      message.success('Propiedad creada con éxito');
      navigate('/property');
    } catch (error) {
      message.error('Error al crear la propiedad');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Añadir Nueva Propiedad</h2>
      <Form
        name="newProperty"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ address: '', sellerId: '' }}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: 'Por favor ingresa la dirección!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Vendedor"
          name="sellerId"
          rules={[{ required: true, message: 'Por favor selecciona un vendedor!' }]}
        >
          <Select placeholder="Selecciona un vendedor">
            {sellers.map((seller) => (
              <Option key={seller._id} value={seller._id}>
                {seller.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Crear Propiedad
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default NewPropertyPage;
