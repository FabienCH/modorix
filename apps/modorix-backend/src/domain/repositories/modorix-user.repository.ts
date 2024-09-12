import { LoginUserRequest } from '@modorix-commons/domain/login/models/user-login';
import { ConfirmSignUpUserRequest, UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';

export const ModorixUserRepositoryToken = Symbol('ModorixUserRepositoryToken');

export interface ModorixUserRepository {
  getUserEmail(email: string): Promise<{ email: string } | null>;
  signUp({ email, password }: { email: string; password: string }): Promise<void>;
  confirmSignUp(confirmSignUpUser: ConfirmSignUpUserRequest): Promise<UserSession>;
  resendAccountConfirmation(email: string): Promise<void>;
  login(loginUserRequest: LoginUserRequest): Promise<UserSession>;
}
