import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import '@modorix-ui/globals.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

export default function App() {
  return <RouterProvider router={router} />;
}
