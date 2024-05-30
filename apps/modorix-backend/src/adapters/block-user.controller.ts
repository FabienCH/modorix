import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BlockUserService } from '../domain/block-user.service';
import { XUserDto } from './x-user-dto';

@Controller()
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Post('block-user')
  @HttpCode(201)
  blockUser(@Body() user: XUserDto): void {
    return this.blockUserService.blockUser(user);
  }
}
