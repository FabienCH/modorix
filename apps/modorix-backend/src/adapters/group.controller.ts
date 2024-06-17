import { Group, GroupDetails } from '@modorix-commons/models/group';
import { Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { GroupNotFoundError } from '../domain/errors/group-not-found-error';
import { GroupsService } from '../domain/group.service';

@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('groups')
  @HttpCode(200)
  groupsList(): Group[] {
    return this.groupsService.groupsList();
  }

  @Get('groups/:groupId')
  @HttpCode(200)
  groupById(@Param() { groupId }: { groupId: string }): GroupDetails {
    return this.groupsService.findGroupById(groupId);
  }

  @Post('groups/join/:groupId')
  @HttpCode(201)
  joinGroup(@Param() { groupId }: { groupId: string }): void {
    try {
      return this.groupsService.joinGroup(groupId);
    } catch (error) {
      this.handleGroupError(error);
    }
  }

  @Post('groups/leave/:groupId')
  @HttpCode(201)
  leaveGroup(@Param() { groupId }: { groupId: string }): void {
    try {
      return this.groupsService.leaveGroup(groupId);
    } catch (error) {
      this.handleGroupError(error);
    }
  }

  private handleGroupError(error: unknown): void {
    if (error instanceof GroupNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
