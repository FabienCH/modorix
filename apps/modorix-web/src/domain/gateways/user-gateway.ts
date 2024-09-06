import { SignUpUserRequest } from '@modorix/commons';

export type SignUpGateway = (signUpUserRequest: SignUpUserRequest) => Promise<void | { error: 'email-used' | 'unknown-error' }>;
