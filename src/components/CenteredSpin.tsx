import React from 'react';
import { ContainerCentered } from '../styles/theme';
import { Spin } from 'antd';

interface CenteredSpinProps {
  tipText?: string;
}

const CenteredSpin: React.FC<CenteredSpinProps> = ({ tipText = "Cargando..." }) => {
  return (
    <ContainerCentered>
      <Spin size="large" tip={tipText}>
        <div style={{ width: 300, height: 300 }} /> {/*Para dar espacio al texto*/}
      </Spin>
    </ContainerCentered>
  );
};

export default CenteredSpin;
