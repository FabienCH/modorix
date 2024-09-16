import { LoginUserRequest, SignUpUserRequest, UserSession } from '@modorix/commons';

export type SignUpGateway = (signUpUserRequest: SignUpUserRequest) => Promise<void | { error: 'email-used' | 'unknown-error' }>;
export type LoginGateway = (
  loginUserRequest: LoginUserRequest,
) => Promise<UserSession | { error: 'invalid-credentials' | 'email-not-confirmed' | 'unknown-error' }>;
