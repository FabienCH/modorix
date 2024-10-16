import { UserSession } from '@modorix-commons/domain/login/models/user-session';
import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthSessionMissingError, isAuthApiError } from '@supabase/supabase-js';
import { UserSignUpEmailValidationError } from '../domain/errors/user-sign-up-email-validation-error';
import { UserSignUpPasswordValidationError } from '../domain/errors/user-sign-up-password-validation-error';
import { ModorixUserService } from '../domain/usecases/modorix-user.service';
import { Public } from '../infrastructure/auth/public.decorator';
import { ModorixUserLoginDto } from './modorix-user-login-dto';
import { ConfirmSignUpUserDto, ModorixUserSignUpDto } from './modorix-user-sign-up-dto';

@Controller()
export class ModorixUserController {
  constructor(private readonly modorixUserService: ModorixUserService) {}

  @Public()
  @Post('users/sign-up')
  @HttpCode(201)
  async signUp(@Body() modorixUserSignUp: ModorixUserSignUpDto): Promise<void> {
    try {
      return await this.modorixUserService.signUp(modorixUserSignUp);
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
      return await this.modorixUserService.confirmSignUp(confirmSignUpUserDto);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  @Public()
  @Post('users/sign-up/resend-account-confirmation')
  @HttpCode(201)
  async resendAccountConfirmation(@Body() { email }: { email: string }): Promise<void> {
    try {
      return await this.modorixUserService.resendAccountConfirmation(email);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  @Public()
  @Post('users/login')
  @HttpCode(201)
  async login(@Body() userLoginDto: ModorixUserLoginDto): Promise<UserSession> {
    try {
      return await this.modorixUserService.login(userLoginDto);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  @Public()
  @Post('users/refresh-token')
  @HttpCode(201)
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }): Promise<UserSession> {
    try {
      return await this.modorixUserService.refreshToken(refreshToken);
    } catch (error) {
      throw this.getAuthError(error);
    }
  }

  private getAuthError(error: unknown): HttpException {
    if (isAuthApiError(error) || error instanceof AuthSessionMissingError) {
      return new HttpException(error.code ?? error.message ?? 'An unexpected error occurred', error.status);
    }
    return new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
