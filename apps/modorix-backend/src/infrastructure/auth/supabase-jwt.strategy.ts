import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUser } from '@supabase/supabase-js';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getEnvValue } from 'src/get-env-value';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('Strategy name', Strategy.name);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnvValue('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(user: AuthUser) {
    return user;
  }
}
