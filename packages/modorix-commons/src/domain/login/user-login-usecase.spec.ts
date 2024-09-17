import { LoginError } from './gateways/user-gateway';
import { LoginUserRequest } from './models/user-login';
import { UserSession } from './models/user-session';
import { loginUser } from './user-login-usecase';

describe('login a user', () => {
  let onLoggedInCalled: boolean;

  function getLoginUserRequest(password: string = 'UserPassword123'): LoginUserRequest {
    return { email: 'john.doe@test.com', password };
  }

  function getLoginGatewayOnError(error: LoginError['error']) {
    return async (_: LoginUserRequest): Promise<LoginError> => ({ error });
  }

  function onLoggedIn(_: UserSession) {
    onLoggedInCalled = true;
  }

  beforeEach(() => {
    onLoggedInCalled = false;
  });

  it('should successfully login a user', async () => {
    const loginUserResult = await loginUser(
      getLoginUserRequest(),
      async (_: LoginUserRequest) => ({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        email: 'john.doe@test.com',
      }),
      onLoggedIn,
    );

    expect(onLoggedInCalled).toBeTruthy();
    expect(loginUserResult).toEqual({
      errorMessage: undefined,
      successMessage: 'You have been successfully logged in, this window will close.',
    });
  });

  it('should not login a user if he provided invalid credentials', async () => {
    const loginUserResult = await loginUser(
      getLoginUserRequest('IncorrectUserPassword123'),
      getLoginGatewayOnError('invalid-credentials'),
      onLoggedIn,
    );

    expect(onLoggedInCalled).toBeFalsy();
    expect(loginUserResult).toEqual({
      errorMessage: 'Your email or password is incorrect.',
      successMessage: undefined,
    });
  });

  it("should not login a user if he hasn't confirmed his email", async () => {
    const loginUserResult = await loginUser(getLoginUserRequest(), getLoginGatewayOnError('email-not-confirmed'), onLoggedIn);

    expect(onLoggedInCalled).toBeFalsy();
    expect(loginUserResult).toEqual({
      errorMessage: 'Your email has not been confirmed. Please check your mailbox for a "Confirm your signup to Modorix" email.',
      successMessage: undefined,
    });
  });

  it('should not login a user if an unknown error occurs', async () => {
    const loginUserResult = await loginUser(getLoginUserRequest(), getLoginGatewayOnError('unknown-error'), onLoggedIn);

    expect(onLoggedInCalled).toBeFalsy();
    expect(loginUserResult).toEqual({
      errorMessage: 'An unknown error occurred, please try again.',
      successMessage: undefined,
    });
  });
});
