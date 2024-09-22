import { confirmUserSignUp } from './confirm-user-sign-up-usecase';

describe('Confirm User Sign Up', () => {
  let hasBeenConfirmed: boolean;
  let isOnError: boolean;

  beforeEach(() => {
    hasBeenConfirmed = false;
    isOnError = false;
  });

  it('should save the user session', async () => {
    const runConfirmSignUp = async () => ({
      accessToken: 'valid access token',
      refreshToken: 'valid refresh token',
      email: 'user@domain.com',
    });
    const onConfirm = () => {
      hasBeenConfirmed = true;
    };
    const onError = (_: 'expired' | 'other') => {};

    await confirmUserSignUp(runConfirmSignUp, onConfirm, onError);

    expect(hasBeenConfirmed).toBeTruthy();
    expect(isOnError).toBeFalsy();
  });

  it('should not save the user session if link is expired', async () => {
    const error = 'expired' as const;
    const runConfirmSignUp = async () => ({ error });
    const onConfirm = () => {};
    const onError = (_: 'expired' | 'other') => {
      isOnError = true;
    };

    await confirmUserSignUp(runConfirmSignUp, onConfirm, onError);

    expect(hasBeenConfirmed).toBeFalsy();
    expect(isOnError).toBeTruthy();
  });

  it('should not save the user session if there is an error', async () => {
    const error = 'other' as const;
    const runConfirmSignUp = async () => ({ error });
    const onConfirm = () => {};
    const onError = (_: 'expired' | 'other') => {
      isOnError = true;
    };

    await confirmUserSignUp(runConfirmSignUp, onConfirm, onError);

    expect(hasBeenConfirmed).toBeFalsy();
    expect(isOnError).toBeTruthy();
  });
});
