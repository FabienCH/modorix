import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import BlocksPage from './pages/blocks-page';
import GroupPage from './pages/group-page';
import GroupsPage from './pages/groups-page';
import { groupLoader } from './routes-loaders';

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
      {
        path: `${ROUTES.Groups}/:groupId`,
        element: <GroupPage />,
        loader: groupLoader,
      },
    ],
  },
]);
