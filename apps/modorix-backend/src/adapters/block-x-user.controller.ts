import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BlockXUsersService } from '../domain/block-x-user.service';
import { BlockReasonError } from '../domain/errors/block-reason-error';
import { BlockXUserRequestDto, XUserDto } from './x-user-dto';

@Controller()
export class BlockXUsersController {
  constructor(private readonly blockXUsersService: BlockXUsersService) {}

  @Post('block-x-users')
  @HttpCode(201)
  blockXUser(@Body() xUser: BlockXUserRequestDto): void {
    try {
      return this.blockXUsersService.blockXUser(xUser);
    } catch (error) {
      if (error instanceof BlockReasonError) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('block-x-users')
  @HttpCode(200)
  blockedXUsersList(): XUserDto[] {
    return this.blockXUsersService.blockedXUsersList();
  }
}
