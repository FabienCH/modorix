import { Group, GroupDetails } from '@modorix-commons/models/group';
import { Injectable } from '@nestjs/common';
import { BlockXUsersRepository } from '../infrastructure/repositories/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/repositories/groups.repository';
import { GroupNotFoundError } from './errors/group-not-found-error';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly blockXUsersRepository: BlockXUsersRepository,
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
