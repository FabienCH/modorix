import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { getEnvValue } from 'src/get-env-value';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseAuth {
  private clientInstance!: SupabaseClient;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getClient() {
    console.log('🚀 ~ SupabaseAuth ~ getClient ~ this.clientInstance:', this.clientInstance);
    if (this.clientInstance) {
      return this.clientInstance;
    }

    return this.setNewClientInstance();
  }

  private setNewClientInstance(): SupabaseClient {
    this.clientInstance = createClient(getEnvValue('SUPABASE_URL'), getEnvValue('SUPABASE_ANON_KEY'), {
      auth: {
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${ExtractJwt.fromAuthHeaderAsBearerToken()(this.request)}`,
        },
      },
    });
    return this.clientInstance;
  }
}
