import { ConfirmSignUpUserRequest, UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { Injectable } from '@nestjs/common';
import { ModorixUserRepository } from '../../../domain/repositories/modorix-user.repository';

@Injectable()
export class ModorixUserInMemoryRepository implements ModorixUserRepository {
  private readonly usedEmail = 'email-used@domain.com';

  async getUserEmail(email: string): Promise<{ email: string } | null> {
    if (email === this.usedEmail) {
      return { email };
    }
    return null;
  }

  async signUp(_: { email: string; password: string }): Promise<void> {
    return;
  }

  async confirmSignUp(_: ConfirmSignUpUserRequest): Promise<UserSession> {
    throw new Error('Method not implemented.');
  }

  async resendAccountConfirmation(_: string): Promise<void> {
    return;
  }
}
