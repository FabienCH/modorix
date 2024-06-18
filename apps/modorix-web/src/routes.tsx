import { LoaderFunctionArgs, createBrowserRouter } from 'react-router-dom';
import { getGroup } from './adapters/gateways/group-gateway';
import Layout from './components/Layout';
import BlocksPage from './pages/blocks-page';
import GroupPage from './pages/group-page';
import GroupsPage from './pages/groups-page';

async function groupLoader({ params }: LoaderFunctionArgs) {
  return await getGroup(params.groupId as string);
}

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
