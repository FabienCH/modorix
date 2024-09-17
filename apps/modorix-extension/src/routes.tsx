import { createMemoryRouter } from 'react-router-dom';
import BlockUsers from './popup/components/block-users-page';
import Login from './popup/components/login-page';
import Popup from './popup/components/Popup';

export enum ROUTES {
  Home = '/',
  Login = '/login',
}

export const router = createMemoryRouter([
  {
    path: ROUTES.Home,
    element: <Popup />,
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
