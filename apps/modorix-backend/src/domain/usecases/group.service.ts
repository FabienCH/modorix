import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
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

  async groupsList(modorixUserId?: string): Promise<Group[]> {
    return await this.groupsRepository.groupsList(modorixUserId);
  }

  async findGroupById(groupId: string, modorixUserId?: string): Promise<GroupDetails> {
    const group = await this.groupsRepository.findGroupById(groupId, modorixUserId);
    if (group === null) {
      throw new GroupNotFoundError(groupId);
    }

    const blockedXUsers = await this.blockXUsersRepository.blockedXUsersByIds(group.blockedXUserIds);
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      isJoined: group.isJoined,
      blockedXUsers,
    };
  }

  async joinGroup(groupId: string, modorixUserId: string): Promise<void> {
    const joinStatusUpdated = await this.groupsRepository.joinGroup(groupId, modorixUserId);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }

  async leaveGroup(groupId: string, modorixUserId: string): Promise<void> {
    const joinStatusUpdated = await this.groupsRepository.leaveGroup(groupId, modorixUserId);
    if (joinStatusUpdated === null) {
      throw new GroupNotFoundError(groupId);
    }
  }
}
