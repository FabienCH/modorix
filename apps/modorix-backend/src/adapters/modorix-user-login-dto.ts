import { LoginUserRequest } from '@modorix-commons/domain/login/models/user-login';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ModorixUserLoginDto implements LoginUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
