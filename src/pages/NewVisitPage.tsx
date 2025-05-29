import React, { useEffect, useState } from 'react';
import { Form, Button, DatePicker, Select, message, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import useProperty from '../hooks/useProperty';
import useVisit from '../hooks/useVisit'; 
import CenteredSpin from '../components/CenteredSpin';
import dayjs from 'dayjs';


const { Option } = Select;

const NewVisitPage: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const { properties, loading, fetchProperties } = useProperty();
  const { createVisit } = useVisit();

  useEffect(() => {
    const initProperties = async () => {
      await fetchProperties();
    };
    initProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const onFinish = async (values: { appointment: dayjs.Dayjs; propertyId: string }) => {
    setErrorMsg(null);

    // appointment viene como moment object, convertir a Date
    const appointmentDate = values.appointment.toDate();

    try {
      await createVisit(appointmentDate, values.propertyId);
      message.success('Visita creada con éxito');
      navigate('/visit');
    } catch (err: unknown ) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error desconocido al crear la visita');
      }
    }
  };

  if (loading) {
    return (
      <CenteredSpin tipText='Cargando Propiedades...' />
    );
  }

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Añadir Nueva Visita</h2>

      {errorMsg && (
        <div style={{ display: "flex", width: "100%", justifyContent: "center"}}>
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 16, width: "300px",  textAlign: "center" }}
          />
        </div>
      )}

      <Form
        name="newVisit"
        onFinish={onFinish}
        layout="vertical"
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
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
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
      </>
  );
};

export default NewVisitPage;
