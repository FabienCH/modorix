import { ConfirmSignUpUserRequest, UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';

export const ModorixUserRepositoryToken = Symbol('ModorixUserRepositoryToken');

export interface ModorixUserRepository {
  getUserEmail(email: string): Promise<{ email: string } | null>;
  signUp({ email, password }: { email: string; password: string }): Promise<void>;
  confirmSignUp(confirmSignUpUser: ConfirmSignUpUserRequest): Promise<UserSession>;
}
