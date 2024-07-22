import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Injectable } from '@nestjs/common';
import { BlockReasonsRepository } from '../infrastructure/repositories/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/repositories/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/repositories/groups.repository';
import { BlockReasonError } from './errors/block-reason-error';
import { XUserNotFoundError } from './errors/x-user-not-found-error';
import { XUserNotInQueueError } from './errors/x-user-not-in-queue';

@Injectable()
export class BlockXUsersService {
  constructor(
    private readonly blockXUsersRepository: BlockXUsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly blockReasonsRepository: BlockReasonsRepository,
  ) {}

  blockXUser(blockXUserRequest: BlockXUserRequest): void {
    const { xId, xUsername, blockedAt, blockReasonIds, blockedInGroupsIds, blockingModorixUserId } = blockXUserRequest;
    if (!blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'empty');
    }

    const blockReasons = this.blockReasonsRepository.blockedReasonsList().filter((blockReason) => blockReasonIds.includes(blockReason.id));
    if (blockReasons.length !== blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'notFound');
    }
    const blockedInGroups = this.groupsRepository.groupsList().filter((group) => blockedInGroupsIds?.includes(group.id));

    const xUser: XUser = {
      xId,
      xUsername,
      blockedAt,
      blockReasons,
      blockingModorixUserIds: [blockingModorixUserId],
      blockedInGroups,
      blockQueueModorixUserIds: [],
    };
    this.blockXUsersRepository.blockXUser(xUser);

    const groupsToBlockXUser = blockedInGroupsIds ? blockedInGroups : this.groupsRepository.groupsList();
    groupsToBlockXUser.forEach((group) => {
      this.groupsRepository.addBlockedUser(group.id, blockXUserRequest.xId);
    });
  }

  blockXUserFromQueue(xUserId: string, modorixUserId: string): void {
    const xUser = this.blockXUsersRepository.blockedXUsersById(xUserId);
    if (!xUser) {
      throw new XUserNotFoundError(xUserId);
    }

    const xUserNotInQueue = !xUser.blockQueueModorixUserIds.find((currModorixUserId) => currModorixUserId === modorixUserId);
    if (xUserNotInQueue) {
      throw new XUserNotInQueueError(xUserId);
    }

    xUser.blockQueueModorixUserIds = xUser.blockQueueModorixUserIds.filter((currModorixUserId) => currModorixUserId !== modorixUserId);
    xUser.blockingModorixUserIds.push(modorixUserId);
    this.blockXUsersRepository.updateXUser(xUser);
  }

  addToBlockQueue(xUserId: string, modorixUserId: string): void {
    const xUser = this.blockXUsersRepository.blockedXUsersById(xUserId);
    if (!xUser) {
      throw new XUserNotFoundError(xUserId);
    }

    xUser.blockQueueModorixUserIds.push(modorixUserId);
    this.blockXUsersRepository.updateXUser(xUser);
  }

  blockedXUsersList(modorixUserId: string): XUser[] {
    return this.blockXUsersRepository.blockedXUsersList(modorixUserId);
  }

  blockQueueCandidates(modorixUserId: string): XUser[] {
    return this.blockXUsersRepository
      .getAllBlockedXUsers()
      .filter(
        (blockedXUser) =>
          !blockedXUser.blockingModorixUserIds.includes(modorixUserId) && !blockedXUser.blockQueueModorixUserIds.includes(modorixUserId),
      );
  }

  blockQueue(modorixUserId: string): XUser[] {
    return this.blockXUsersRepository
      .getAllBlockedXUsers()
      .filter((blockedXUser) => blockedXUser.blockQueueModorixUserIds.includes(modorixUserId));
  }
}
