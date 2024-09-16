import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import '@modorix-ui/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
