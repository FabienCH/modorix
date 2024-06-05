import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import BlocksPage from './pages/blocks-page';
import GroupsPage from './pages/groups-page';

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
