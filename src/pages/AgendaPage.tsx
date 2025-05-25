import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Select } from 'antd';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import useVisit from '../hooks/useVisit';
import { IoSearchCircleOutline } from 'react-icons/io5';
import { HeaderPageContainer } from '../styles/theme';
import CenteredSpin from '../components/CenteredSpin';
import { generateColorFromString } from '../helpers/color';
import Title from 'antd/es/typography/Title';

const { Option } = Select;



const HomePage: React.FC = () => {
  const { visits, fetchVisits, loading,  } = useVisit();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

    useEffect(() => {
      const init = async () => {
        await fetchVisits();
      };
      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const propertyColorMap = useMemo(() => {
    const map = new Map<string, string>();
    visits.forEach((visit) => {
      const propertyId = visit.property?._id;
      if (propertyId && !map.has(propertyId)) {
        map.set(propertyId, generateColorFromString(propertyId));
      }
    });
    return map;
  }, [visits]);

  const uniqueProperties = useMemo(() => {
    const map = new Map<string, string>();
    visits.forEach((visit) => {
      const propertyId = visit.property?._id;
      const address = visit.property?.address ?? 'Sin dirección';
      if (propertyId && !map.has(propertyId)) {
        map.set(propertyId, address);
      }
    });
    return Array.from(map.entries());
  }, [visits]);

  const filteredVisits = useMemo(() => {
    if (!selectedPropertyId) return visits;
    return visits.filter((v) => v.property?._id === selectedPropertyId);
  }, [visits, selectedPropertyId]);

  const events = filteredVisits.map((visit) => {
    const propertyId = visit.property?._id;
    const color = propertyId ? propertyColorMap.get(propertyId) : '#ccc';
    return {
      title: visit.property?.address ?? 'Sin dirección',
      start: visit.appointment,
      end: new Date(new Date(visit.appointment).getTime() + 60 * 60 * 1000),
      url: `/visit/${visit._id}`,
      backgroundColor: color,
      borderColor: color,
    };
  });

  if (loading) {
    return (
      <CenteredSpin tipText='Cargando Agenda...'/>
    );
  }

  return (
    <>
    <HeaderPageContainer>
          <Title level={3}>Agenda semanal de visitas</Title>
          <Select
            allowClear
            placeholder="Filtrar por propiedad"
            style={{ width: 300, marginLeft: 16 }}
            onChange={(value) => setSelectedPropertyId(value)}
            value={selectedPropertyId || undefined}
            showSearch
            optionFilterProp="children"
            suffixIcon={<IoSearchCircleOutline style={{ color: '#666', fontSize: 25 }} />}
            filterOption={(input, option) =>
              option?.children
                ? option.children.toString().toLowerCase().includes(input.toLowerCase())
                : false
            }
          >
            {uniqueProperties.map(([id, address]) => (
              <Option key={id} value={id}>
                {address}
              </Option>
            ))}
          </Select>
        </HeaderPageContainer>
    <Card>
      {filteredVisits.length === 0 ? (
        <Typography.Text type="secondary">No hay visitas esta semana.</Typography.Text>
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
          }}
          firstDay={1}
          locale={esLocale}
          events={events}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          nowIndicator={true}
          height="auto"
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            navigate(info.event.url ?? '/');
          }}
        />
      )}
    </Card>
    </>
    
  );
};

export default HomePage;
