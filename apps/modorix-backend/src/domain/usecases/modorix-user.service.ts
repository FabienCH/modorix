import { ConfirmSignUpUserRequest, SignUpUserRequest, UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { passwordCharactersRegexp } from '@modorix-commons/domain/sign-up/password-validation-regexp';
import { Inject, Injectable } from '@nestjs/common';
import { UserSignUpEmailValidationError } from '../errors/user-sign-up-email-validation-error';
import { UserSignUpPasswordValidationError } from '../errors/user-sign-up-password-validation-error';
import { ModorixUserRepository, ModorixUserRepositoryToken } from '../repositories/modorix-user.repository';

@Injectable()
export class ModorixXUserService {
  constructor(@Inject(ModorixUserRepositoryToken) private readonly modorixUserRepository: ModorixUserRepository) {}

  async signUp({ email, password, confirmPassword }: SignUpUserRequest): Promise<void> {
    if (password !== confirmPassword) {
      throw new UserSignUpPasswordValidationError('passwordMissmatch');
    }

    const passwordComplexityMatches = password.match(new RegExp(passwordCharactersRegexp));
    if (!passwordComplexityMatches || password.length < 8) {
      throw new UserSignUpPasswordValidationError('passwordComplexity');
    }

    const usedEmail = (await this.modorixUserRepository.getUserEmail(email)) !== null;
    if (usedEmail) {
      throw new UserSignUpEmailValidationError(email);
    }

    return this.modorixUserRepository.signUp({ email, password });
  }

  async confirmSignUp(confirmSignUpUser: ConfirmSignUpUserRequest): Promise<UserSession> {
    return this.modorixUserRepository.confirmSignUp(confirmSignUpUser);
  }
}
