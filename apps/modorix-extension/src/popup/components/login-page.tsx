import LoginForm, { LoginFromValues } from '@modorix-commons/components/login-form';
import { loginUser } from '@modorix-commons/domain/login/user-login-usecase';
import { login } from '@modorix-commons/gateways/http-user-gateway';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { UserSession } from '@modorix/commons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserInfosFromBrowserStorage,
  saveUserSessionInBrowserStorage,
} from '../../content/infrastructure/storage/browser-user-session-storage';
import { ROUTES } from '../../routes';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { setUserSessionInfos } = useUserSessionInfos();

  async function onLoggedIn(userSession: UserSession) {
    saveUserSessionInBrowserStorage(userSession);
    setUserSessionInfos(await getUserInfosFromBrowserStorage());
    navigate(ROUTES.Home);
  }

  async function handleLogin(fromValues: LoginFromValues): Promise<void> {
    const { errorMessage } = await loginUser(fromValues, login, onLoggedIn);
    setErrorMessage(errorMessage);
  }

  return (
    <div className="p-3">
      <LoginForm loginErrorMessage={errorMessage} onLogin={handleLogin}></LoginForm>
    </div>
  );
}
