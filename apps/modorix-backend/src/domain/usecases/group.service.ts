import { Group, GroupDetails } from '@modorix-commons/models/group';
import { Inject, Injectable } from '@nestjs/common';
import { GroupNotFoundError } from '../errors/group-not-found-error';
import { BlockXUsersRepository, BlockXUsersRepositoryToken } from '../repositories/block-x-user.repository';
import { GroupsRepository, GroupsRepositoryToken } from '../repositories/groups.repository';

@Injectable()
export class GroupsService {
  constructor(
    @Inject(BlockXUsersRepositoryToken) private readonly blockXUsersRepository: BlockXUsersRepository,
    @Inject(GroupsRepositoryToken) private readonly groupsRepository: GroupsRepository,
  ) {}

  groupsList(): Group[] {
    return this.groupsRepository.groupsList();
  }

  findGroupById(groupId: string): GroupDetails {
    const group = this.groupsRepository.findGroupById(groupId);
    if (group === null) {
      throw new GroupNotFoundError(groupId);
    }

    const blockedXUsers = this.blockXUsersRepository.blockedXUsersByIds(group.blockedXUserIds);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      isJoined: group.isJoined,
      blockedXUsers,
    };
  }

  joinGroup(groupId: string): void {
    const joinStatusUpdated = this.groupsRepository.updateIsJoined(groupId, true);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }

  leaveGroup(groupId: string): void {
    const joinStatusUpdated = this.groupsRepository.updateIsJoined(groupId, false);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }
}
