import { LoginUserRequest, SignUpUserRequest, UserSession } from '@modorix/commons';

export type LoginError = { error: 'invalid-credentials' | 'email-not-confirmed' | 'unknown-error' };
export type SignUpError = { error: 'email-used' | 'unknown-error' };

export type SignUpGateway = (signUpUserRequest: SignUpUserRequest) => Promise<void | SignUpError>;
export type LoginGateway = (loginUserRequest: LoginUserRequest) => Promise<UserSession | LoginError>;
