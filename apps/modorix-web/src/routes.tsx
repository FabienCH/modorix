import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import BlocksPage from './blocks-page';
import GroupsPage from './groups-page';

export enum ROUTES {
  Home = '/',
  Groups = '/groups',
}
export const router = createBrowserRouter([
  {
    path: ROUTES.Home,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BlocksPage />,
      },
      {
        path: ROUTES.Groups,
        element: <GroupsPage />,
      },
    ],
  },
]);
