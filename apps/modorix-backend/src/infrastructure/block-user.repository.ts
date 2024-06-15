import { BlockReason } from '@modorix-commons/models/block-reason';
import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockReasonsRepository } from './block-reason.repository';

@Injectable()
export class BlockUsersRepository {
  private readonly blockedUsers: XUser[] = [];
  private readonly blockReasons: BlockReason[];

  constructor(private readonly blockReasonsRepository: BlockReasonsRepository) {
    this.blockReasons = this.blockReasonsRepository.blockedReasonsList();
  }

  blockUser(blockUserRequest: BlockXUserRequest): void {
    const { id, blockedAt, blockReasonIds } = blockUserRequest;
    const user = { id, blockedAt, blockReasons: this.blockReasons.filter((blockReason) => blockReasonIds.includes(blockReason.id)) };
    this.blockedUsers.push(user);
  }

  blockedUsersList(): XUser[] {
    return this.blockedUsers;
  }
}
