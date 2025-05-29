import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useSeller from '../hooks/useSeller';
import useProperty from '../hooks/useProperty';
import CenteredSpin from '../components/CenteredSpin';

const { Option } = Select;

const NewPropertyPage: React.FC = () => {
  const navigate = useNavigate();

  const { sellers, fetchSellers, loading } = useSeller();
  const { createProperty } = useProperty();

  useEffect(() => {
    const init = async () => {
      await fetchSellers();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: { address: string; sellerId: string }) => {
    try {
      await createProperty(values.address, values.sellerId);
      message.success('Propiedad creada con éxito');
      navigate('/property');
    } catch (error) {
      message.error('Error al crear la propiedad');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <CenteredSpin tipText="Cargando Vendedores..." />;
  }

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
