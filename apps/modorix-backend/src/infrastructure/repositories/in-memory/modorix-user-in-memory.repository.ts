import { LoginUserRequest } from '@modorix-commons/domain/login/models/user-login';
import { UserSession } from '@modorix-commons/domain/login/models/user-session';
import { ConfirmSignUpUserRequest } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { Injectable } from '@nestjs/common';
import { AuthApiError } from '@supabase/supabase-js';
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

  async confirmSignUp(confirmSignUpUserRequest: ConfirmSignUpUserRequest): Promise<UserSession> {
    if (!confirmSignUpUserRequest.tokenHash) {
      throw new AuthApiError('Link has expired', 400, 'otp_expired');
    }
    return { accessToken: 'valid-access-token', refreshToken: 'refresh-token', email: 'john.doe@test.com' };
  }

  async resendAccountConfirmation(_: string): Promise<void> {
    return;
  }

  async login(loginUserRequest: LoginUserRequest): Promise<UserSession> {
    if (!loginUserRequest.password) {
      throw new AuthApiError('Invalid Credentials', 400, 'invalid-credentials');
    }
    if (!loginUserRequest.email) {
      throw new AuthApiError('Email address not confirmed', 400, 'email-not-confirmed');
    }
    return { accessToken: 'valid-access-token', refreshToken: 'refresh-token', email: 'john.doe@test.com' };
  }

  refreshToken(_: string): Promise<UserSession> {
    throw new Error('Method not implemented.');
  }
}
