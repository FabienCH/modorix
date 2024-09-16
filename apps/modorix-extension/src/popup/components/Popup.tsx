import ProfileIcon from '@modorix-commons/components/profile-icon';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { Button } from '@modorix-ui/components/button';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserInfosFromBrowserStorage } from '../../content/infrastructure/storage/browser-user-session-storage';
import { ROUTES } from '../../routes';

export default function Popup() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userSessionInfos, setUserSessionInfos } = useUserSessionInfos();

  useEffect(() => {
    (async () => {
      setUserSessionInfos(await getUserInfosFromBrowserStorage());
    })();
  }, [setUserSessionInfos]);

  function navigateTo() {
    navigate(pathname === ROUTES.Home ? ROUTES.Login : '..');
  }

  return (
    <>
      <header className="flex justify-between p-3 pb-0">
        <img src="/icon/48.png" className="w-7 h-7 mr-1.5" />
        {userSessionInfos.hasValidAccessToken ? (
          <ProfileIcon email={userSessionInfos.userEmail} />
        ) : (
          <Button onClick={navigateTo}>{pathname === ROUTES.Home ? 'Login' : 'Back'}</Button>
        )}
      </header>
      <Outlet />
    </>
  );
}
