import React, { useState } from 'react';
import { Form, Button, DatePicker, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useProperty from '../hooks/useProperty';
import useVisit from '../hooks/useVisit'; 

const { Option } = Select;

const NewVisitPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { properties } = useProperty();
  const { createVisit } = useVisit();


  const onFinish = async (values: { appointment: string; propertyId: string }) => {
    setLoading(true);


    const appointmentISO = new Date(values.appointment);

    try {
      await createVisit(appointmentISO, values.propertyId);
      message.success('Visita creada con éxito');
      navigate('/visit');
    } catch (error) {
      message.error('Error al crear la visita');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Añadir Nueva Visita</h2>
      <Form
        name="newVisit"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ appointment: '', propertyId: '' }}
        style={{ maxWidth: 400, margin: 'auto' }}
      >

        <Form.Item
          label="Propiedad"
          name="propertyId"
          rules={[{ required: true, message: 'Por favor selecciona una propiedad!' }]}
        >
          <Select placeholder="Selecciona una propiedad">
            {properties.map((property) => (
              <Option key={property._id} value={property._id}>
                {property.address}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Fecha de la Cita"
          name="appointment"
          rules={[{ required: true, message: 'Por favor ingresa la fecha de la cita!' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Selecciona la fecha y hora"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Crear Visita
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewVisitPage;
