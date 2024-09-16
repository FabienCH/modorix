import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import { UserSessionProvider } from '@modorix-commons/infrastructure/user-session-context';
import '@modorix-ui/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <UserSessionProvider>
      <RouterProvider router={router} />
    </UserSessionProvider>
  </React.StrictMode>,
);
