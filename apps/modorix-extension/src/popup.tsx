import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import '@modorix-ui/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup/components/Popup';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
