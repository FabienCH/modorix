import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import { UserSessionProvider } from '@modorix-commons/infrastructure/user-session-context';
import '@modorix-ui/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup/components/Popup';
import { DependenciesProvider } from './shared/infrastructure/dependencies-provider';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <DependenciesProvider>
      <UserSessionProvider>
        <Popup />
      </UserSessionProvider>
    </DependenciesProvider>
  </React.StrictMode>,
);
