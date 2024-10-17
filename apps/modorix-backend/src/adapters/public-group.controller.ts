import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { Public } from 'src/infrastructure/auth/public.decorator';
import { GroupNotFoundError } from '../domain/errors/group-not-found-error';
import { GroupsService } from '../domain/usecases/group.service';

@Controller()
export class PublicGroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Get('public/groups')
  @HttpCode(200)
  groupsList(): Promise<Group[]> {
    return this.groupsService.groupsList();
  }

  @Public()
  @Get('public/groups/:groupId')
  @HttpCode(200)
  async groupById(@Param() { groupId }: { groupId: string }): Promise<GroupDetails> {
    try {
      return await this.groupsService.findGroupById(groupId);
    } catch (error) {
      throw this.getGroupError(error);
    }
  }

  private getGroupError(error: unknown): HttpException {
    console.log('🚀 ~ GroupsController ~ getGroupError ~ error:', error);
    if (error instanceof GroupNotFoundError) {
      return new NotFoundException(error.message);
    }
    return new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
