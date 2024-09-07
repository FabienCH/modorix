import { ConfirmSignUpUserRequest } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { EmailOtpType } from '@supabase/auth-js';

export interface SupabaseConfirmSignUpUser extends ConfirmSignUpUserRequest {
  type: EmailOtpType;
}
