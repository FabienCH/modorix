import { UserSession } from '@modorix-commons/domain/sign-up/models/user-sign-up';
import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { isAuthApiError } from '@supabase/supabase-js';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { UserSignUpEmailValidationError } from '../domain/errors/user-sign-up-email-validation-error';
import { UserSignUpPasswordValidationError } from '../domain/errors/user-sign-up-password-validation-error';
import { ModorixXUserService } from '../domain/usecases/modorix-user.service';
import { ConfirmSignUpUserDto, ModorixUserSignUpDto } from './modorix-user-sign-up-dto';

@Controller()
export class ModorixUserController {
  constructor(private readonly modorixXUserService: ModorixXUserService) {}

  @Public()
  @Post('users/sign-up')
  @HttpCode(201)
  async signUp(@Body() modorixUserSignUp: ModorixUserSignUpDto): Promise<void> {
    try {
      return await this.modorixXUserService.signUp(modorixUserSignUp);
    } catch (error) {
      if (error instanceof UserSignUpPasswordValidationError || error instanceof UserSignUpEmailValidationError) {
        throw new BadRequestException(error.message);
      }
      throw this.getAuthError(error);
    }
  }

  @Public()
  @Post('users/sign-up/confirm')
  @HttpCode(201)
  async confirmSignUp(@Body() confirmSignUpUserDto: ConfirmSignUpUserDto): Promise<UserSession> {
    try {
      return await this.modorixXUserService.confirmSignUp(confirmSignUpUserDto);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  @Public()
  @Post('users/sign-up/resend-account-confirmation')
  @HttpCode(201)
  async resendAccountConfirmation(@Body() { email }: { email: string }): Promise<void> {
    try {
      return await this.modorixXUserService.resendAccountConfirmation(email);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  private getAuthError(error: unknown): HttpException {
    if (isAuthApiError(error)) {
      return new HttpException(error.code ?? 'An unexpected error occurred', error.status);
    }
    return new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
