import { UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ModorixUserRepository } from 'src/domain/repositories/modorix-user.repository';
import { SupabaseAuth } from 'src/infrastructure/auth/supabase-auth';
import { PG_DATABASE } from 'src/infrastructure/database/drizzle.module';
import { pgUsedUserEmail } from 'src/infrastructure/database/schema/usedUserEmail';
import { SupabaseConfirmSignUpUser } from './supabase-user-sign-up';

@Injectable()
export class ModorixUserSupabaseRepository implements ModorixUserRepository {
  constructor(
    @Inject(PG_DATABASE) private pgDatabase: NodePgDatabase,
    private readonly supabaseAuth: SupabaseAuth,
  ) {}

  async getUserEmail(email: string): Promise<{ email: string } | null> {
    const emails = await this.pgDatabase
      .select({ email: pgUsedUserEmail.email })
      .from(pgUsedUserEmail)
      .where(eq(pgUsedUserEmail.email, email));

    return emails.length ? emails[0] : null;
  }

  async signUp({ email, password }: { email: string; password: string }): Promise<void> {
    const { error } = await this.supabaseAuth.getClient().auth.signUp({ email, password });

    if (error) {
      throw error;
    }
  }

  async confirmSignUp({ type, tokenHash }: SupabaseConfirmSignUpUser): Promise<UserSession> {
    const { data, error } = await this.supabaseAuth.getClient().auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      throw error;
    }
    const { user, session } = data;
    if (!user || !user.email || !session) {
      throw new Error('User session could not be retrieved.');
    }

    return { email: user.email, accessToken: session.access_token, refreshToken: session.refresh_token };
  }
}
