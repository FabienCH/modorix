import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ModorixUserSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
