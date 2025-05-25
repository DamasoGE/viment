import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Tag, Dropdown, Menu, DatePicker, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useVisit, { Visit } from '../hooks/useVisit';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { IoSearchCircleOutline } from 'react-icons/io5';
import { ContainerFlex, HeaderPageContainer } from '../styles/theme';
import CenteredSpin from '../components/CenteredSpin';
import { getStatusColor, statusTextMap } from '../helpers/status';
import dayjs, { Dayjs } from 'dayjs';

const VisitPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const navigate = useNavigate();
  const { visits, loading, error, updateVisit, fetchVisits } = useVisit();
  const [visitFilter, setVisitFilter] = useState<Visit[]>([]);


  useEffect(() => {
    const init = async () => {
      await fetchVisits();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = visits;

    if (searchTerm) {
      filtered = filtered.filter((visit) =>
        visit.property?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.status?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((visit) => {
        const visitDate = dayjs(visit.appointment);
        return visitDate.isAfter(startDate.startOf('day')) && visitDate.isBefore(endDate.endOf('day'));
      });
    }

    setVisitFilter(filtered);
  }, [searchTerm, startDate, endDate, visits]);

  const handleStatusChange = async (visitId: string, status: string) => {
    try {
      await updateVisit(visitId, "status", status);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const columns: ColumnsType<Visit> = [
    {
      title: 'Acciones',
      width: 100,
      align: 'center',
      key: 'actions',
      render: (_, visit) => (
        <Space>
          <Link to={`/visit/${visit._id}`}>
            <SettingOutlined style={{ color: "black", fontSize: "18px" }} />
          </Link>
        </Space>
      ),
    },
    {
      title: 'Cita',
      dataIndex: 'appointment',
      key: 'appointment',
      render: (appointment: Date) => {
        const date = new Date(appointment);
        return "📅" + date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) + '     ⌚' + date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      },
    },
    {
      title: 'Propiedad',
      dataIndex: 'property',
      key: 'property',
      render: (_, visit) =>
        visit.property ? (
          <Link to={`/property/${visit.property._id}`}>
            {visit.property.address}
          </Link>
        ) : (
          'No asignada'
        ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, visit: Visit) => {
          const menuItems = Object.entries(statusTextMap).map(([key, label]) => ({
          key,
          label,
          }));
        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(visit._id, key)}
            items={menuItems}
          />
        );

        return (
          <>
            <div style={{ minWidth: 90, display: 'inline-block' }}>
              <Tag color={getStatusColor(status)} style={{ width: '100%', textAlign: 'center' }}>
                {statusTextMap[status]}
              </Tag>
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
              <EditOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
            </Dropdown>
          </>
        );
      },
    },
  ];

  if (loading) {
    return <CenteredSpin tipText='Cargando Visitas...' />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <HeaderPageContainer>
        <ContainerFlex>
          <Input
            placeholder="Buscar por propiedad o estado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
          />

          <DatePicker
            placeholder="Desde"
            value={startDate}
            onChange={setStartDate}
            style={{ height: 40 }}
          />

          <DatePicker
            placeholder="Hasta"
            value={endDate}
            onChange={setEndDate}
            style={{ height: 40 }}
          />
        </ContainerFlex>


        <Button
          type="primary"
          style={{ height: 40 }}
          onClick={() => navigate('/visit/new')}
        >
          Crear Nueva Visita
        </Button>
      </HeaderPageContainer>

      <Table
        columns={columns}
        dataSource={visitFilter}
        rowKey="_id"
        locale={{
        emptyText: <Empty description="No hay datos para ese filtro" />,
        }}
      />
    </>
  );
};

export default VisitPage;
