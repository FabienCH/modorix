export const ModorixUserRepositoryToken = Symbol('ModorixUserRepositoryToken');

export interface ModorixUserRepository {
  signUp({ email, password }: { email: string; password: string }): Promise<void>;
}
