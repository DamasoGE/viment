import React, { useEffect, useState } from 'react';
import { List, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Visit } from '../hooks/useVisit';

const PropertyVisitSection: React.FC<{ propertyVisits: Visit[]; propertyId: string; }> = ({ propertyVisits }) => {
  
    const [visits, setVisits] = useState<Visit[]>([])

    useEffect(() => {
        setVisits(propertyVisits);
    }, [propertyVisits])


    const getStatusColor = (status: string) => {
        switch (status) {
          case 'pending':
            return 'gold';
          case 'completed':
            return 'green';
          case 'cancelled':
            return 'red';
          default:
            return 'default';
        }
      };
    
      const statusTextMap: Record<string, string> = {
        pending: 'Pendiente',
        completed: 'Completada',
        cancelled: 'Cancelada',
      };
    
  
  return (
    <>
    { visits.length === 0 ? (
            <Typography.Text type="secondary">No hay visitas registradas.</Typography.Text>
        ) : (
            <List
            dataSource={propertyVisits}
            renderItem={(visit) => (
                <List.Item>
                <List.Item.Meta
                    title={
                    <Link to={`/visit/${visit._id}`}>
                        <Tag color={getStatusColor(visit.status)}>
                        {statusTextMap[visit.status]}
                        </Tag>
                        {new Date(visit.appointment).toLocaleString()}
                    </Link>
                    }
                    description={
                    <div style={{ paddingLeft: '20px' }}>
                        {visit.comment || 'Sin comentario'}
                    </div>
                    }
                />
                </List.Item>
            )}
            />
        )}
    </>
  );
};

export default PropertyVisitSection;
