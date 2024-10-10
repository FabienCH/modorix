import { BlockEvent } from '@modorix-commons/domain/models/block-event';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { BlockXUser, XUser } from '@modorix-commons/domain/models/x-user';
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

  async blockXUser(blockXUserRequest: BlockXUser): Promise<void> {
    const { xId, xUsername, blockedAt, blockReasonIds, blockedInGroupsIds, blockingModorixUserId } = blockXUserRequest;
    if (!blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'empty');
    }

    const blockReasons = await this.blockReasonsRepository.blockedReasonsByIds(blockReasonIds);
    if (blockReasons.length !== blockReasonIds.length) {
      throw new BlockReasonError(xUsername, 'notFound');
    }
    const blockedInGroups = (await this.groupsRepository.groupsByIds(blockedInGroupsIds ?? [])).map((group) => ({
      id: group.id,
      name: group.name,
    }));
    const blockEvent: BlockEvent = {
      modorixUserId: blockingModorixUserId,
      blockedAt,
      blockReasons,
      blockedInGroups,
    };
    const xUser = await this.blockXUsersRepository.blockedXUsersByXId(xId);
    console.log('🚀 ~ BlockXUsersService ~ blockXUser ~ xUser:', xUser);
    if (xUser) {
      await this.blockXUsersRepository.addBlockEvent(xId, blockEvent);
    } else {
      const xUserToAdd: XUser = {
        xId,
        xUsername,
        blockEvents: [blockEvent],
        blockQueueModorixUserIds: [],
      };
      await this.blockXUsersRepository.blockXUser(xUserToAdd);
    }
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
    const { blockReasons, blockedInGroups } = xUser.blockEvents.reduce<{
      blockReasons: BlockReason[];
      blockedInGroups: Array<{
        id: string;
        name: string;
      }>;
    }>(
      (eventValues, blockEvent) => {
        blockEvent.blockReasons.forEach((eventBlockReason) => {
          if (!eventValues.blockReasons.find((blockReason) => blockReason.id === eventBlockReason.id)) {
            eventValues.blockReasons.push(eventBlockReason);
          }
        });
        blockEvent.blockedInGroups.forEach((eventBlockedInGroups) => {
          if (!eventValues.blockedInGroups.find((blockedInGroups) => blockedInGroups.id === eventBlockedInGroups.id)) {
            eventValues.blockedInGroups.push(eventBlockedInGroups);
          }
        });
        return eventValues;
      },
      { blockReasons: [], blockedInGroups: [] },
    );

    const blockEvent: BlockEvent = {
      modorixUserId,
      blockedAt: new Date().toISOString(),
      blockReasons,
      blockedInGroups,
    };
    xUser.blockEvents.push(blockEvent);

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
        !blockedXUser.blockEvents.find((blockEvent) => blockEvent.modorixUserId === modorixUserId) &&
        !blockedXUser.blockQueueModorixUserIds.includes(modorixUserId),
    );
  }

  async blockQueue(modorixUserId: string): Promise<XUser[]> {
    return (await this.blockXUsersRepository.getAllBlockedXUsers()).filter((blockedXUser) =>
      blockedXUser.blockQueueModorixUserIds.includes(modorixUserId),
    );
  }
}
