import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Tooltip, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useProperty, { Property } from '../hooks/useProperty';
import useVisit from '../hooks/useVisit';
import { ColumnsType } from 'antd/es/table';
import { UpOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { IoSearchCircleOutline } from 'react-icons/io5';
import CenteredSpin from '../components/CenteredSpin';
import { HeaderPageContainer } from '../styles/theme';

const PropertyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const { properties, fetchProperties, loading: loadingProperties, updateProperty } = useProperty();
  const { visits, loading: loadingVisits, fetchVisits } = useVisit();

  const [propertyFilter, setPropertyFilter] = useState<Property[]>([]);

  useEffect(() => {
    const initProperties = async () => {
      await fetchProperties();
    };
    initProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const initVisits = async () => {
      await fetchVisits();
    };
    initVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter((property) =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.seller?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
      setPropertyFilter(filtered);
    } else {
      setPropertyFilter(properties);
    }
  }, [searchTerm, properties]);

  const changeCounter = async (property: Property, field: keyof Property, delta: number) => {
    const current = (property[field] as number) || 0;
    const newValue = Math.max(0, current + delta);
    await updateProperty(property._id!, field, newValue.toString());
  };

  const getNextVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    return propertyVisits
      .filter((visit) => new Date(visit.appointment) > new Date())
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime())[0];
  };

  const getPreviousVisit = (propertyId: string) => {
    const propertyVisits = visits.filter((visit) => visit.property._id === propertyId);
    return propertyVisits
      .filter((visit) => new Date(visit.appointment) < new Date())
      .sort((a, b) => new Date(b.appointment).getTime() - new Date(a.appointment).getTime())[0];
  };

  const getTimesVisited = (propertyId: string): number => {
    return visits.filter(
      (visit) =>
        visit.property._id === propertyId && visit.status === 'completed'
    ).length;
  };

  const sortedProperties = [...propertyFilter].sort((a, b) => {
    const nextVisitA = getNextVisit(a._id!);
    const nextVisitB = getNextVisit(b._id!);
    if (!nextVisitA) return 1;
    if (!nextVisitB) return -1;
    return new Date(nextVisitA.appointment).getTime() - new Date(nextVisitB.appointment).getTime();
  });

  const counterColumn = (title: string, field: keyof Property): ColumnsType<Property>[number] => ({
    title,
    key: field as string,
    render: (_, property) => {
      const value = Number(property[field] ?? 0);
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>{value}</span>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 8 }}>
            <Tooltip title={`Aumentar ${title.toLowerCase()}`}>
              <Button
                icon={<UpOutlined />}
                onClick={() => changeCounter(property, field, 1)}
                size="small"
                type="default"
                style={{ padding: '0 6px', height: 15, width: 15 }}
              />
            </Tooltip>
            <Tooltip title={`Disminuir ${title.toLowerCase()}`}>
              <Button
                icon={<DownOutlined />}
                onClick={() => changeCounter(property, field, -1)}
                size="small"
                type="default"
                style={{ padding: '0 6px', height: 15, width: 15 }}
                disabled={value === 0}
              />
            </Tooltip>
          </div>
        </div>
      );
    },
  });

  const columns: ColumnsType<Property> = [
    {
      title: 'Acciones',
      width: 100,
      align: 'center',
      key: 'actions',
      render: (_, property) => (
        <Space>
          <Link to={`/property/${property._id!}`}>
            <SettingOutlined style={{ color: "black", fontSize: "18px" }} />
          </Link>
        </Space>
      ),
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Vendedor',
      dataIndex: 'seller',
      key: 'seller',
      render: (_, property) =>
        property.seller ? (
          <Link to={`/seller/${property.seller._id!}`}>
            {property.seller.username}
          </Link>
        ) : (
          'No asignado'
        ),
    },
    counterColumn('Vistas Detalle', 'timesDetailView'),
    counterColumn('Veces Interesado', 'timesInterested'),
    counterColumn('Veces Listada', 'timesListed'),
    counterColumn('Veces Ofrecida', 'timesOffered'),
    {
      title: 'Veces Visitada',
      key: 'calculatedTimesVisited',
      render: (_, property) => (
        <span>{getTimesVisited(property._id!)}</span>
      ),
    },
    {
      title: 'Próxima Visita',
      key: 'nextVisit',
      render: (_, property) => {
        const nextVisit = getNextVisit(property._id!);
        return nextVisit ? (
          <Link to={`/visit/${nextVisit._id!}`}>
            {"📅 " + new Date(nextVisit.appointment).toLocaleDateString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }) + "     ⌚" + new Date(nextVisit.appointment).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Link>
        ) : (
          'No hay visitas programadas'
        );
      },
    },
    {
      title: 'Última Visita',
      key: 'previousVisit',
      render: (_, property) => {
        const previousVisit = getPreviousVisit(property._id!);
        return previousVisit ? (
          <Link to={`/visit/${previousVisit._id!}`}>
            {"📅 " + new Date(previousVisit.appointment).toLocaleDateString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }) + "     ⌚" + new Date(previousVisit.appointment).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Link>
        ) : (
          'No hay visitas anteriores'
        );
      },
    },
  ];

  if (loadingVisits || loadingProperties) {
    return (
      <CenteredSpin tipText='Cargando Propiedades...' />
    );
  }

  return (
    <>
      <HeaderPageContainer>
        <Input
          placeholder="Buscar por dirección o vendedor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<IoSearchCircleOutline style={{ color: '#666', fontSize: 30 }} />}
          style={{
            width: 320,
          }}
        />
        <Button
          type="primary"
          style={{ height: 40 }}
          onClick={() => navigate('/property/new')}
        >
          Crear Nueva Propiedad
        </Button>
      </HeaderPageContainer>

      <Table
        columns={columns}
        dataSource={sortedProperties}
        rowKey="_id"
        scroll={{ x: true }}
        locale={{
        emptyText: <Empty description="No hay datos para ese filtro" />,
        }}
      />
    </>
  );
};

export default PropertyPage;
