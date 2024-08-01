import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Inject, Injectable } from '@nestjs/common';
import { BlockReasonError } from '../errors/block-reason-error';
import { XUserNotFoundError } from '../errors/x-user-not-found-error';
import { XUserNotInQueueError } from '../errors/x-user-not-in-queue';
import { BlockReasonsRepository, BlockReasonsRepositoryToken } from '../repositories/block-reason.repository';
import { BlockXUsersRepository, BlockXUsersRepositoryToken } from '../repositories/block-x-user.repository';
import { GroupsRepository, GroupsRepositoryToken } from '../repositories/groups.repository';

@Injectable()
export class BlockXUsersService {
  constructor(
    @Inject(BlockXUsersRepositoryToken) private readonly blockXUsersRepository: BlockXUsersRepository,
    @Inject(GroupsRepositoryToken) private readonly groupsRepository: GroupsRepository,
    @Inject(BlockReasonsRepositoryToken) private readonly blockReasonsRepository: BlockReasonsRepository,
  ) {}

  async blockXUser(blockXUserRequest: BlockXUserRequest): Promise<void> {
    const { xId, xUsername, blockedAt, blockReasonIds, blockedInGroupsIds, blockingModorixUserId } = blockXUserRequest;
    if (!blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'empty');
    }

    const blockReasons = await this.blockReasonsRepository.blockedReasonsByIds(blockReasonIds);
    if (blockReasons.length !== blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'notFound');
    }
    const blockedInGroups = await this.groupsRepository.groupsByIds(blockedInGroupsIds ?? []);

    const xUser: XUser = {
      xId,
      xUsername,
      blockedAt,
      blockReasons,
      blockingModorixUserIds: [blockingModorixUserId],
      blockedInGroups,
      blockQueueModorixUserIds: [],
    };
    await this.blockXUsersRepository.blockXUser(xUser);
  }

  async blockXUserFromQueue(xUserId: string, modorixUserId: string): Promise<void> {
    const xUser = await this.blockXUsersRepository.blockedXUsersByXId(xUserId);
    if (!xUser) {
      throw new XUserNotFoundError(xUserId);
    }

    const xUserNotInQueue = !xUser.blockQueueModorixUserIds.find((currModorixUserId) => currModorixUserId === modorixUserId);
    if (xUserNotInQueue) {
      throw new XUserNotInQueueError(xUserId);
    }

    xUser.blockQueueModorixUserIds = xUser.blockQueueModorixUserIds.filter((currModorixUserId) => currModorixUserId !== modorixUserId);
    xUser.blockingModorixUserIds.push(modorixUserId);
    await this.blockXUsersRepository.updateXUser(xUser);
  }

  async addToBlockQueue(xUserId: string, modorixUserId: string): Promise<void> {
    const xUser = await this.blockXUsersRepository.blockedXUsersByXId(xUserId);
    if (!xUser) {
      throw new XUserNotFoundError(xUserId);
    }

    xUser.blockQueueModorixUserIds.push(modorixUserId);
    await this.blockXUsersRepository.updateXUser(xUser);
  }

  async blockedXUsersList(modorixUserId: string): Promise<XUser[]> {
    return this.blockXUsersRepository.blockedXUsersList(modorixUserId);
  }

  async blockQueueCandidates(modorixUserId: string): Promise<XUser[]> {
    return (await this.blockXUsersRepository.getAllBlockedXUsers()).filter(
      (blockedXUser) =>
        !blockedXUser.blockingModorixUserIds.includes(modorixUserId) && !blockedXUser.blockQueueModorixUserIds.includes(modorixUserId),
    );
  }

  async blockQueue(modorixUserId: string): Promise<XUser[]> {
    return (await this.blockXUsersRepository.getAllBlockedXUsers()).filter((blockedXUser) =>
      blockedXUser.blockQueueModorixUserIds.includes(modorixUserId),
    );
  }
}
