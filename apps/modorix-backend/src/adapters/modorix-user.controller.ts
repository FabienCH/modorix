import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { isAuthApiError } from '@supabase/supabase-js';
import { UserSignUpValidationError } from 'src/domain/errors/user-sign-up-validation-error';
import { ModorixXUserService } from 'src/domain/usecases/modorix-user.service';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { ModorixUserSignUpDto } from './modorix-user-sign-up-dto';

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
      if (error instanceof UserSignUpValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isAuthApiError(error)) {
        throw new HttpException(error.code ?? 'An unexpected error occurred', error.status);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
