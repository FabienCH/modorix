import ProfileIcon from '@modorix-commons/components/profile-icon';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@modorix-ui/components/navigation-menu';
import { getUserInfosFromStorage } from '@modorix/commons';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import BanLogo from '../../public/icon/ban-solid.svg?react';
import GroupLogo from '../../public/icon/people-group-solid.svg?react';
import { ROUTES } from '../routes';
import { LoginDialog } from './login/login-dialog';
import { SignUpDialog } from './sign-up/sign-up-dialog';

export default function Header() {
  const { userSessionInfos, setUserSessionInfos } = useUserSessionInfos();
  const { dependencies } = useDependenciesContext();

  useEffect(() => {
    (async () => {
      setUserSessionInfos(await getUserInfosFromStorage(dependencies.userSessionStorage.getItem));
    })();
  }, [dependencies, setUserSessionInfos]);

  function getNavLinkClassName(isActive: boolean): string {
    return navigationMenuTriggerStyle(isActive ? { className: 'text-modorix-700 font-medium' } : undefined);
  }

  return (
    <header className="border-b flex px-4 py-3 bg-white md:px-10">
      <div className="flex items-center flex-1 mx-auto max-w-screen-xl relative justify-between">
        <div className="flex pr-6">
          <img src="/icon/48.png" className="w-8 mr-2" />
          <span className="text-2xl lithos-font text-shadow">
            Modori<span className="text-primary">x</span>
          </span>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="mr-2">
              <NavLink to={ROUTES.Home} className={({ isActive }) => getNavLinkClassName(isActive)}>
                <BanLogo className="w-4 mr-2" />
                Blocks
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink to={ROUTES.Groups} className={({ isActive }) => getNavLinkClassName(isActive)}>
                <GroupLogo className="w-[18px] mr-2" />
                Groups
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {userSessionInfos?.hasValidAccessToken ? (
          <ProfileIcon email={userSessionInfos.userEmail} />
        ) : (
          <div>
            <LoginDialog />
            <SignUpDialog />
          </div>
        )}
      </div>
    </header>
  );
}
