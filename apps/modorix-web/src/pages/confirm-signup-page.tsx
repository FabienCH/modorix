import { saveUserSession } from '@modorix-commons/storage/cookies-user-session-storage';
import { UserSession } from '@modorix/commons';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmSignUp } from '../adapters/gateways/modorix-user-gateway';
import { confirmUserSignUp } from '../domain/confirm-user-sign-up-usecase';
import { ROUTES } from '../routes';

export default function ConfirmSignUpPage() {
  const [searchParams] = useSearchParams();
  const [confirmError, setConfirmError] = useState<'expired' | 'other' | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    function onConfirm(userSession: UserSession) {
      saveUserSession(userSession);
      navigate(ROUTES.Home);
    }
    function runConfirmSignUp() {
      return confirmSignUp({ tokenHash: searchParams.get('token_hash') as string, type: searchParams.get('type') as string });
    }

    confirmUserSignUp(runConfirmSignUp, onConfirm, setConfirmError);
  }, [searchParams, navigate]);

  return (
    <section className="w-full mx-auto max-w-screen-lg">
      {confirmError ? (
        <p>{confirmError === 'expired' ? 'Your link has expired' : 'An error occurred, try to confirm your email again'}</p>
      ) : (
        <p>Your email is being confirmed...</p>
      )}
    </section>
  );
}
