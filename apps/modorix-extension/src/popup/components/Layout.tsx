import ProfileIcon from '@modorix-commons/components/profile-icon';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { Button } from '@modorix-ui/components/button';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userSessionInfos } = useUserSessionInfos();

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
