import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, List, Typography, Spin } from 'antd';
import useVisit from '../hooks/useVisit';

const HomePage: React.FC = () => {
  const { visits, loading } = useVisit();

  const upcomingVisits = useMemo(() => {
    return [...visits]
      .filter((v) => new Date(v.appointment) > new Date())
      .sort((a, b) => new Date(a.appointment).getTime() - new Date(b.appointment).getTime())
      .slice(0, 3);
  }, [visits]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Inicio</h1>

      <Card title="Próximas Visitas">
        {loading ? (
          <Spin tip="Cargando visita...">
            <div style={{ width: 200, height: 100 }} />
          </Spin>
        ) : upcomingVisits.length === 0 ? (
          <Typography.Text type="secondary">No hay visitas próximas.</Typography.Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={upcomingVisits}
            renderItem={(visit) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link to={`/visit/${visit._id}`}>
                      {new Date(visit.appointment).toLocaleString()}
                    </Link>
                  }
                  description={`Propiedad: ${visit.property?.address ?? 'No disponible'}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default HomePage;
