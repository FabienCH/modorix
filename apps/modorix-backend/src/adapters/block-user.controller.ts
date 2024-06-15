import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BlockUsersService } from '../domain/block-user.service';
import { BlockReasonError } from '../domain/errors/block-reason-error';
import { BlockXUserRequestDto, XUserDto } from './x-user-dto';

@Controller()
export class BlockUsersController {
  constructor(private readonly blockUsersService: BlockUsersService) {}

  @Post('block-users')
  @HttpCode(201)
  blockUser(@Body() user: BlockXUserRequestDto): void {
    try {
      return this.blockUsersService.blockUser(user);
    } catch (error) {
      if (error instanceof BlockReasonError) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('block-users')
  @HttpCode(200)
  blockedUsersList(): XUserDto[] {
    return this.blockUsersService.blockedUsersList();
  }
}
