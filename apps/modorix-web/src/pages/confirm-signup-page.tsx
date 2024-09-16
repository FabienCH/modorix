import { UserSession } from '@modorix/commons';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmSignUp } from '../adapters/gateways/modorix-user-gateway';
import { saveUserSessionInCookies } from '../adapters/storage/cookies-user-session-storage';
import ConfirmSignUpError from '../components/sign-up/confirm-sign-up-error';
import { confirmUserSignUp } from '../domain/confirm-user-sign-up-usecase';
import { ROUTES } from '../routes';

export default function ConfirmSignUpPage() {
  const [searchParams] = useSearchParams();
  const [isSignUpConfirmed, setIsSignUpConfirmed] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<'expired' | 'other' | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    function onConfirm(userSession: UserSession) {
      saveUserSessionInCookies(userSession);
      setIsSignUpConfirmed(true);
      setTimeout(() => {
        navigate(ROUTES.Home);
      }, 3000);
    }
    function runConfirmSignUp() {
      return confirmSignUp({ tokenHash: searchParams.get('token_hash') as string, type: searchParams.get('type') as string });
    }

    confirmUserSignUp(runConfirmSignUp, onConfirm, setConfirmError);
  }, [searchParams, navigate]);

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      {confirmError ? (
        <ConfirmSignUpError confirmError={confirmError} />
      ) : (
        <p className="text-center text-xl text-modorix-800 pt-3">
          {isSignUpConfirmed ? 'Your account has been confirmed, you are about to be redirected' : 'Your account is being confirmed...'}
        </p>
      )}
    </section>
  );
}
