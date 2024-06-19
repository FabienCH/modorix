import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockReasonError } from './errors/block-reason-error';

@Injectable()
export class BlockXUsersService {
  constructor(
    private readonly blockXUsersRepository: BlockXUsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly blockReasonsRepository: BlockReasonsRepository,
  ) {}

  blockXUser(blockXUserRequest: BlockXUserRequest): void {
    const { id, blockedAt, blockReasonIds, blockingUserId } = blockXUserRequest;
    if (!blockReasonIds.length) {
      throw new BlockReasonError(id, 'empty');
    }

    const blockReasons = this.blockReasonsRepository.blockedReasonsList().filter((blockReason) => blockReasonIds.includes(blockReason.id));
    if (blockReasons.length !== blockReasonIds.length) {
      throw new BlockReasonError(id, 'notFound');
    }

    const xUser = { id, blockedAt, blockReasons };
    this.blockXUsersRepository.blockXUser({ ...xUser, blockingUserIds: [blockingUserId] });
    const groups = this.groupsRepository.groupsList();
    groups.forEach((group) => {
      this.groupsRepository.addBlockedUser(group.id, blockXUserRequest.id);
    });
  }

  blockedXUsersList(modorixUserId: string): XUser[] {
    return this.blockXUsersRepository.blockedXUsersList(modorixUserId);
  }

  blockQueueCandidates(modorixUserId: string): XUser[] {
    return this.blockXUsersRepository.blockQueueCandidates(modorixUserId);
  }
}
