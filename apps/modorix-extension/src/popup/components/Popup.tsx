import { UserSessionProvider, useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getUserInfosFromBrowserStorage } from '../../content/infrastructure/storage/browser-user-session-storage';
import { router } from '../../routes';

export default function Popup() {
  const { setUserSessionInfos } = useUserSessionInfos();

  useEffect(() => {
    (async () => {
      setUserSessionInfos(await getUserInfosFromBrowserStorage());
    })();
  }, [setUserSessionInfos]);

  return (
    <UserSessionProvider>
      <RouterProvider router={router} />
    </UserSessionProvider>
  );
}
