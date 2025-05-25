import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ContainerCentered } from '../styles/theme';

const ErrorPage: React.FC = () => {
  return (
    <ContainerCentered>
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
    </ContainerCentered>

  );
};

export default ErrorPage;
