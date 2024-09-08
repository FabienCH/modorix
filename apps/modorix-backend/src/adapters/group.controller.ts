import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { GroupNotFoundError } from '../domain/errors/group-not-found-error';
import { GroupsService } from '../domain/usecases/group.service';

@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Get('groups')
  @HttpCode(200)
  groupsList(): Promise<Group[]> {
    return this.groupsService.groupsList();
  }

  @Public()
  @Get('groups/:groupId')
  @HttpCode(200)
  async groupById(@Param() { groupId }: { groupId: string }): Promise<GroupDetails> {
    try {
      return await this.groupsService.findGroupById(groupId);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  @Post('groups/join/:groupId')
  @HttpCode(201)
  async joinGroup(@Param() { groupId }: { groupId: string }): Promise<void> {
    try {
      return await this.groupsService.joinGroup(groupId);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  @Post('groups/leave/:groupId')
  @HttpCode(201)
  async leaveGroup(@Param() { groupId }: { groupId: string }): Promise<void> {
    try {
      return await this.groupsService.leaveGroup(groupId);
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
