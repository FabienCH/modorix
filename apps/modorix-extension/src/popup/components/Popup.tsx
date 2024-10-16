import { getUserInfosFromStorage } from '@modorix-commons/domain/login/storage/user-session-storage';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../../routes';

export default function Popup() {
  const { setUserSessionInfos } = useUserSessionInfos();
  const { dependencies } = useDependenciesContext();

  useEffect(() => {
    (async () => {
      setUserSessionInfos(await getUserInfosFromStorage(dependencies.userSessionStorage.getItem));
    })();
  }, [dependencies, setUserSessionInfos]);

  return <RouterProvider router={router} />;
}
