import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { BlockUsersService } from '../domain/block-user.service';
import { XUserDto } from './x-user-dto';

@Controller()
export class BlockUsersController {
  constructor(private readonly blockUsersService: BlockUsersService) {}

  @Post('block-users')
  @HttpCode(201)
  blockUser(@Body() user: XUserDto): void {
    return this.blockUsersService.blockUser(user);
  }

  @Get('block-users')
  @HttpCode(200)
  blockedUsersList(): XUserDto[] {
    return this.blockUsersService.blockedUsersList();
  }
}
