import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { GroupNotFoundError } from '../domain/errors/group-not-found-error';
import { GroupsService } from '../domain/usecases/group.service';
import { AuthUser } from './auth-user.decorator';

@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('groups')
  @HttpCode(200)
  groupsList(@AuthUser() user: JwtPayload): Promise<Group[]> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    return this.groupsService.groupsList(user.sub);
  }

  @Get('groups/:groupId')
  @HttpCode(200)
  async groupById(@AuthUser() user: JwtPayload, @Param() { groupId }: { groupId: string }): Promise<GroupDetails> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.groupsService.findGroupById(groupId, user.sub);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  @Post('groups/join/:groupId')
  @HttpCode(201)
  async joinGroup(@AuthUser() user: JwtPayload, @Param() { groupId }: { groupId: string }): Promise<void> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.groupsService.joinGroup(groupId, user.sub);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  @Post('groups/leave/:groupId')
  @HttpCode(201)
  async leaveGroup(@AuthUser() user: JwtPayload, @Param() { groupId }: { groupId: string }): Promise<void> {
    if (!user.sub) {
      throw new UnauthorizedException();
    }
    try {
      return await this.groupsService.leaveGroup(groupId, user.sub);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  private getGroupError(error: unknown): HttpException {
    if (error instanceof GroupNotFoundError) {
      return new NotFoundException(error.message);
    }
    return new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
