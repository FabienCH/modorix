import { ConfirmSignUpUserRequest, SignUpUserRequest } from '@modorix-commons/models/user-sign-up';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ModorixUserSignUpDto implements SignUpUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword!: string;
}

export class ConfirmSignUpUserDto implements ConfirmSignUpUserRequest {
  @IsNotEmpty()
  tokenHash!: string;
  @IsNotEmpty()
  type!: string;
}
