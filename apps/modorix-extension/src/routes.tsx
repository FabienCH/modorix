import { createMemoryRouter } from 'react-router-dom';
import BlockUsers from './popup/components/block-users-page';
import Layout from './popup/components/Layout';
import Login from './popup/components/login-page';

export enum ROUTES {
  Home = '/',
  Login = '/login',
}

export const router = createMemoryRouter([
  {
    path: ROUTES.Home,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BlockUsers />,
      },
      {
        path: ROUTES.Login,
        element: <Login />,
      },
    ],
  },
]);
