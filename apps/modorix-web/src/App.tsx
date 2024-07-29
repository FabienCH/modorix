import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import '@modorix-ui/globals.css';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export default function App() {
  useEffect(() => {
    setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);
  }, []);
  return <RouterProvider router={router} />;
}
