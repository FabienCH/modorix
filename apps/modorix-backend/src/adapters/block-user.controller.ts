import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { BlockUserService } from '../domain/block-user.service';
import { XUserDto } from './x-user-dto';

@Controller()
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) { }

  @Post('block-user')
  @HttpCode(204)
  blockUser(@Body() user: XUserDto): void {
    return this.blockUserService.blockUser(user);
  }
}
