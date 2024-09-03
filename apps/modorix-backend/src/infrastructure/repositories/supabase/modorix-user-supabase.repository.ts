import { Injectable } from '@nestjs/common';
import { ModorixUserRepository } from 'src/domain/repositories/modorix-user.repository';
import { SupabaseAuth } from 'src/infrastructure/auth/supabase-auth';

@Injectable()
export class ModorixUserSupabaseRepository implements ModorixUserRepository {
  constructor(private readonly supabaseAuth: SupabaseAuth) {}

  async signUp({ email, password }: { email: string; password: string }): Promise<void> {
    const { data, error } = await this.supabaseAuth.getClient().auth.signUp({
      email,
      password,
    });
    console.log('🚀 ~ ModorixUserSupabaseRepository ~ supabaseAuth.getClient ~ data:', data);
    console.log('🚀 ~ ModorixUserSupabaseRepository ~ supabaseAuth.getClient ~ error:', error);
  }
}
