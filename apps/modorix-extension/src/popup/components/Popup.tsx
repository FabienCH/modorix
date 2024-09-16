import ProfileIcon from '@modorix-commons/components/profile-icon';
import { Button } from '@modorix-ui/components/button';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  getAccessTokenFromBrowserStorage,
  getUserEmailFromBrowserStorage,
} from '../../content/infrastructure/storage/browser-user-session-storage';
import { ROUTES } from '../../routes';

export default function Popup() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setAccessToken(await getAccessTokenFromBrowserStorage());
      setUserEmail(await getUserEmailFromBrowserStorage());
    })();
  }, []);

  function navigateTo() {
    navigate(pathname === ROUTES.Home ? ROUTES.Login : '..');
  }

  return (
    <>
      <header className="flex justify-between p-3 pb-0">
        <img src="/icon/48.png" className="w-7 h-7 mr-1.5" />
        {accessToken ? (
          <ProfileIcon email={userEmail} />
        ) : (
          <Button onClick={navigateTo}>{pathname === ROUTES.Home ? 'Login' : 'Back'}</Button>
        )}
      </header>
      <Outlet />
    </>
  );
}
