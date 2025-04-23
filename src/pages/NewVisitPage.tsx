import React, { useState } from 'react';
import { Form, Button, DatePicker, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useProperty from '../hooks/useProperty'; // Importa el hook para propiedades
import useVisit from '../hooks/useVisit'; // Importa el hook para visitas

const { Option } = Select;

const NewVisitPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { properties } = useProperty(); // Obtén las propiedades desde el hook
  const { createVisit } = useVisit(); // Obtén la función para crear visitas

  // Función que se ejecuta al enviar el formulario
  const onFinish = async (values: { appointment: string; propertyId: string }) => {
    setLoading(true);

    // Convertir la fecha a formato ISO 8601 si no está en ese formato
    const appointmentISO = new Date(values.appointment);

    try {
      await createVisit(appointmentISO, values.propertyId);
      message.success('Visita creada con éxito');
      navigate('/visit'); // Redirigir a la página de visitas
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
        {/* Campo para seleccionar la propiedad */}
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

        {/* Campo para seleccionar la fecha de la cita */}
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

        {/* Botón para crear la visita */}
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
