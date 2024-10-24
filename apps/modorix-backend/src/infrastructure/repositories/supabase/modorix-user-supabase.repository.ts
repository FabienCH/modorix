import { LoginUserRequest } from '@modorix-commons/domain/login/models/user-login';
import { UserSession } from '@modorix-commons/domain/login/models/user-session';
import { Inject, Injectable } from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { eq } from 'drizzle-orm';
import { ModorixUserRepository } from '../../../domain/repositories/modorix-user.repository';
import { SupabaseAuth } from '../../auth/supabase-auth';
import { PG_DATABASE } from '../../database/drizzle.module';
import { TypedNodePgDatabase } from '../../database/schema/schema';
import { pgUsedUserEmail } from '../../database/schema/used-user-email';
import { SupabaseConfirmSignUpUser } from './supabase-user-sign-up';

@Injectable()
export class ModorixUserSupabaseRepository implements ModorixUserRepository {
  private readonly supabaseAuthClient: SupabaseAuthClient;

  constructor(
    @Inject(PG_DATABASE) private pgDatabase: TypedNodePgDatabase,
    private readonly supabaseAuth: SupabaseAuth,
  ) {
    this.supabaseAuthClient = this.supabaseAuth.getClient().auth;
  }

  async getUserEmail(email: string): Promise<{ email: string } | null> {
    const emails = await this.pgDatabase
      .select({ email: pgUsedUserEmail.email })
      .from(pgUsedUserEmail)
      .where(eq(pgUsedUserEmail.email, email));

    return emails.length ? emails[0] : null;
  }

  async signUp({ email, password }: { email: string; password: string }): Promise<void> {
    const { error } = await this.supabaseAuthClient.signUp({ email, password });

    if (error) {
      throw error;
    }
  }

  async confirmSignUp({ type, tokenHash }: SupabaseConfirmSignUpUser): Promise<UserSession> {
    const authResponse = await this.supabaseAuthClient.verifyOtp({ type, token_hash: tokenHash });

    return this.mapToUserSession(authResponse);
  }

  async resendAccountConfirmation(email: string): Promise<void> {
    await this.supabaseAuthClient.resend({ type: 'signup', email });
  }

  async login(loginUserRequest: LoginUserRequest): Promise<UserSession> {
    const authResponse = await this.supabaseAuthClient.signInWithPassword(loginUserRequest);

    return this.mapToUserSession(authResponse);
  }

  async refreshToken(refreshToken: string): Promise<UserSession> {
    const authResponse = await this.supabaseAuthClient.refreshSession({ refresh_token: refreshToken });

    return this.mapToUserSession(authResponse);
  }

  private mapToUserSession({ data, error }: AuthResponse): UserSession {
    if (error) {
      throw error;
    }

    const { user, session } = data;
    if (!user || !user.email || !session) {
      throw new Error('User session could not be retrieved.');
    }

    return { email: user.email, accessToken: session.access_token, refreshToken: session.refresh_token, userId: user.id };
  }
}
