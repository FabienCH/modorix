import { SignUpUserRequest } from '@modorix-commons/models/user-sign-up';
import { Inject, Injectable } from '@nestjs/common';
import { UserSignUpValidationError } from '../errors/user-sign-up-validation-error';
import { ModorixUserRepository, ModorixUserRepositoryToken } from '../repositories/modorix-user.repository';

@Injectable()
export class ModorixXUserService {
  constructor(@Inject(ModorixUserRepositoryToken) private readonly modorixUserRepository: ModorixUserRepository) {}

  async signUp({ email, password, confirmPassword }: SignUpUserRequest): Promise<void> {
    if (password !== confirmPassword) {
      throw new UserSignUpValidationError();
    }

    await this.modorixUserRepository.signUp({ email, password });
  }
}
