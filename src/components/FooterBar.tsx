import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterBar: React.FC = () => {
  return (
      <Footer style={{display: 'flex', justifyContent:'center', alignItems: 'center', fontWeight:'bold'}}>
            Dámaso © 2025
      </Footer>
  );
};

export default FooterBar;