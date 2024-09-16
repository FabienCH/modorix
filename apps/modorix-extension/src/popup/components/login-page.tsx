import LoginForm, { LoginFromValues } from '@modorix-commons/components/login-form';
import { loginUser } from '@modorix-commons/domain/login/user-login-usecase';
import { login } from '@modorix-commons/gateways/http-user-gateway';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserSessionInBrowserStorage } from '../../content/infrastructure/storage/browser-user-session-storage';
import { ROUTES } from '../../routes';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  async function handleLogin(fromValues: LoginFromValues): Promise<void> {
    const { errorMessage } = await loginUser(fromValues, login, saveUserSessionInBrowserStorage);
    setErrorMessage(errorMessage);
    if (errorMessage) {
      navigate(ROUTES.Home);
    }
  }

  return (
    <div className="p-3">
      <LoginForm loginErrorMessage={errorMessage} onLogin={handleLogin}></LoginForm>
    </div>
  );
}
