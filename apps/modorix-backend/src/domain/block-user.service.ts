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
    if (!blockUserRequest.blockReasonIds.length) {
      throw new BlockReasonError(blockUserRequest.id, 'empty');
    }
    const blockReasonsIds = this.blockReasonsRepository.blockedReasonsList().flatMap((reason) => reason.id);
    const notFoundReason = blockUserRequest.blockReasonIds.find((reasonId) => !blockReasonsIds.includes(reasonId));
    if (notFoundReason) {
      throw new BlockReasonError(blockUserRequest.id, 'notFound');
    }

    this.blockUsersRepository.blockUser(blockUserRequest);
    const groups = this.groupsRepository.groupsList();
    groups.forEach((group) => {
      this.groupsRepository.addBlockedUser(group.id, blockUserRequest.id);
    });
  }

  blockedUsersList(): XUser[] {
    return this.blockUsersRepository.blockedUsersList();
  }
}
