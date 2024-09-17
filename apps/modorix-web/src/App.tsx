import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import { UserSessionProvider } from '@modorix-commons/infrastructure/user-session-context';
import '@modorix-ui/globals.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

export default function App() {
  return (
    <UserSessionProvider>
      <RouterProvider router={router} />;
    </UserSessionProvider>
  );
}
