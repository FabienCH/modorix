import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { BlockReasonError } from '../domain/errors/block-reason-error';
import { XUserNotFoundError } from '../domain/errors/x-user-not-found-error';
import { XUserNotInQueueError } from '../domain/errors/x-user-not-in-queue';
import { BlockXUsersService } from '../domain/usecases/block-x-user.service';
import { AuthUser } from './auth-user.decorator';
import { BlockXUserRequestDto, XUserDto } from './x-user-dto';

@Controller()
export class BlockXUsersController {
  constructor(private readonly blockXUsersService: BlockXUsersService) {}

  @Post('block-x-users')
  @HttpCode(201)
  async blockXUser(@AuthUser() user: JwtPayload, @Body() xUser: BlockXUserRequestDto): Promise<void> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.blockXUsersService.blockXUser({ ...xUser, blockedAt: new Date(xUser.blockedAt), blockingModorixUserId: user.sub });
    } catch (error) {
      if (error instanceof BlockReasonError) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('block-x-users/from-queue')
  @HttpCode(201)
  async blockXUserFromQueue(@AuthUser() user: JwtPayload, @Body() { xUserId }: { xUserId: string }): Promise<void> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.blockXUsersService.blockXUserFromQueue(xUserId, user.sub);
    } catch (error) {
      if (error instanceof XUserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof XUserNotInQueueError) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('block-x-users/queue')
  @HttpCode(201)
  async addXUserToBlockQueue(@AuthUser() user: JwtPayload, @Body() { xUserId }: { xUserId: string }): Promise<void> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.blockXUsersService.addToBlockQueue(xUserId, user.sub);
    } catch (error) {
      if (error instanceof XUserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('block-x-users')
  @HttpCode(200)
  async blockedXUsersList(@AuthUser() user: JwtPayload): Promise<XUserDto[]> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    return await this.blockXUsersService.blockedXUsersList(user.sub);
  }

  @Get('block-x-users/queue/candidates')
  @HttpCode(200)
  async blockQueueCandidates(@AuthUser() user: JwtPayload): Promise<XUserDto[]> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    return await this.blockXUsersService.blockQueueCandidates(user.sub);
  }

  @Get('block-x-users/queue')
  @HttpCode(200)
  async blockQueue(@AuthUser() user: JwtPayload): Promise<XUserDto[]> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    return await this.blockXUsersService.blockQueue(user.sub);
  }
}
