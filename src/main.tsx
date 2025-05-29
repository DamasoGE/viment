import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './helpers/dayjsConfig.ts';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={esES}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
