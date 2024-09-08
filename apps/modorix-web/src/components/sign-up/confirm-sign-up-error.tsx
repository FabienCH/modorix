import { useState } from 'react';
import { resendAccountConfirmation } from '../../adapters/gateways/modorix-user-gateway';
import ResendConfirmLinkForm, { ResendLinkFromValues } from './resend-confirm-link-form';

export default function ConfirmSignUpError({ confirmError }: { confirmError: 'expired' | 'other' }) {
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  async function resendLink({ email }: ResendLinkFromValues) {
    await resendAccountConfirmation(email);
    setEmailSubmitted(true);
  }

  return confirmError === 'expired' ? (
    <>
      <p className="text-center text-xl text-destructive pt-3">Your link has expired, you can request a new one.</p>
      <ResendConfirmLinkForm handleSubmit={resendLink} />
      {emailSubmitted ? (
        <p className="text-center text-modorix-800">If you created an account with this email, you will receive a new link</p>
      ) : null}
    </>
  ) : (
    <p className="text-center text-xl text-destructive pt-3">An error occurred, try to confirm your email again.</p>
  );
}
