import { signUpUser } from './user-sign-up-usecase';

describe('User sign up', () => {
  it('should sign up a user', async () => {
    const signUpResult = await signUpUser(
      {
        email: 'useremail@domain.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
      async () => {},
    );

    expect(signUpResult).toEqual({ signedUpEmail: 'useremail@domain.com', errorMessage: undefined });
  });

  it('should not sign up a user if email is already used', async () => {
    const signUpResult = await signUpUser(
      {
        email: 'useremail@domain.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
      async () => ({ error: 'email-used' }),
    );

    expect(signUpResult).toEqual({ signedUpEmail: undefined, errorMessage: 'Email is already used.' });
  });

  it('should not sign up a user if there is an error', async () => {
    const signUpResult = await signUpUser(
      {
        email: 'useremail@domain.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
      async () => ({ error: 'unknown-error' }),
    );

    expect(signUpResult).toEqual({ signedUpEmail: undefined, errorMessage: 'An unknown error occurred, please try again.' });
  });
});
