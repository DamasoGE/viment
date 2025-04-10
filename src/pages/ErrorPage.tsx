import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <Result
        status="404"
        title="404"
        subTitle="¡Ups! La página que buscas no existe."
        extra={
          <Button type="primary">
            <Link to="/">Volver al inicio</Link>
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
