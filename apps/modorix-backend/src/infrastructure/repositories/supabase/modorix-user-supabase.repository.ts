import { UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { Inject, Injectable } from '@nestjs/common';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ModorixUserRepository } from '../../../domain/repositories/modorix-user.repository';
import { SupabaseAuth } from '../../auth/supabase-auth';
import { PG_DATABASE } from '../../database/drizzle.module';
import { pgUsedUserEmail } from '../../database/schema/usedUserEmail';
import { SupabaseConfirmSignUpUser } from './supabase-user-sign-up';

@Injectable()
export class ModorixUserSupabaseRepository implements ModorixUserRepository {
  private readonly supabaseAuthClient: SupabaseAuthClient;

  constructor(
    @Inject(PG_DATABASE) private pgDatabase: NodePgDatabase,
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
    const { data, error } = await this.supabaseAuthClient.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      throw error;
    }

    const { user, session } = data;
    if (!user || !user.email || !session) {
      throw new Error('User session could not be retrieved.');
    }

    return { email: user.email, accessToken: session.access_token, refreshToken: session.refresh_token };
  }

  async resendAccountConfirmation(email: string): Promise<void> {
    await this.supabaseAuthClient.resend({ type: 'signup', email });
  }
}
