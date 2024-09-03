import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { isAuthApiError } from '@supabase/supabase-js';
import { ModorixXUserService } from 'src/domain/usecases/modorix-user.service';
import { ModorixUserSignUpDto } from './modorix-user-dto';

@Controller()
export class ModorixUserController {
  constructor(private readonly modorixXUserService: ModorixXUserService) {}

  @Post('users/sing-up')
  @HttpCode(201)
  signUp(@Body() modorixUserSignUp: ModorixUserSignUpDto): Promise<void> {
    try {
      return this.modorixXUserService.signUp(modorixUserSignUp);
    } catch (error) {
      if (isAuthApiError(error)) {
        throw new HttpException(error.code ?? 'unknown error', error.status);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
