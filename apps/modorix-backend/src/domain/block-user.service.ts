import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockReasonError } from './errors/block-reason-error';

@Injectable()
export class BlockUsersService {
  constructor(
    private readonly blockUsersRepository: BlockUsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly blockReasonsRepository: BlockReasonsRepository,
  ) {}

  blockUser(blockUserRequest: BlockXUserRequest): void {
    const { id, blockedAt, blockReasonIds } = blockUserRequest;

    if (!blockReasonIds.length) {
      throw new BlockReasonError(blockUserRequest.id, 'empty');
    }

    const blockReasons = this.blockReasonsRepository.blockedReasonsList().filter((blockReason) => blockReasonIds.includes(blockReason.id));
    if (blockReasons.length !== blockReasonIds.length) {
      throw new BlockReasonError(id, 'notFound');
    }

    const xUser = { id, blockedAt, blockReasons };
    this.blockUsersRepository.blockUser(xUser);

    const groups = this.groupsRepository.groupsList();
    groups.forEach((group) => {
      this.groupsRepository.addBlockedUser(group.id, blockUserRequest.id);
    });
  }

  blockedUsersList(): XUser[] {
    return this.blockUsersRepository.blockedUsersList();
  }
}
