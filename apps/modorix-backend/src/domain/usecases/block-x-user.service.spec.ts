import { BlockReason } from '@modorix-commons/models/block-reason';
import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockReasonsInMemoryRepository } from '../../infrastructure/repositories/in-memory/block-reason-in-memory.repository';
import { BlockXUsersInMemoryRepository } from '../../infrastructure/repositories/in-memory/block-x-user-in-memory.repository';
import { GroupsInMemoryRepository } from '../../infrastructure/repositories/in-memory/groups-in-memory.repository';
import { BlockReasonError } from '../errors/block-reason-error';
import { XUserNotFoundError } from '../errors/x-user-not-found-error';
import { XUserNotInQueueError } from '../errors/x-user-not-in-queue';
import { BlockReasonsRepositoryToken } from '../repositories/block-reason.repository';
import { BlockXUsersRepositoryToken } from '../repositories/block-x-user.repository';
import { GroupsRepositoryToken } from '../repositories/groups.repository';
import { BlockXUsersService } from './block-x-user.service';

describe('BlockXUsersService', () => {
  function getBlockXUserRequest(blockReasonIds: string[], blockedInGroupsIds = []): BlockXUserRequest {
    return {
      xId: '1',
      xUsername: '@username',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasonIds,
      blockedInGroupsIds,
      blockingModorixUserId: '1',
    };
  }
  function checkExpectedXUser(blockedXUser: XUser | undefined, blockReasons: BlockReason[]) {
    expect(blockedXUser).toEqual({
      xId: '1',
      xUsername: '@username',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasons,
      blockingModorixUserIds: ['1'],
      blockedInGroups: [],
      blockQueueModorixUserIds: [],
    });
  }

  let blockXUsersService: BlockXUsersService;
  let blockXUsersRepository: BlockXUsersInMemoryRepository;
  let groupsRepository: GroupsInMemoryRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        BlockXUsersService,
        { provide: GroupsRepositoryToken, useClass: GroupsInMemoryRepository },
        { provide: BlockXUsersRepositoryToken, useClass: BlockXUsersInMemoryRepository },
        { provide: BlockReasonsRepositoryToken, useClass: BlockReasonsInMemoryRepository },
      ],
    }).compile();

    blockXUsersService = app.get<BlockXUsersService>(BlockXUsersService);
    blockXUsersRepository = app.get<BlockXUsersInMemoryRepository>(BlockXUsersRepositoryToken);
    groupsRepository = app.get<GroupsInMemoryRepository>(GroupsRepositoryToken);

    await blockXUsersRepository.blockXUser({
      xId: '862285194',
      xUsername: '@UltraEurope',
      blockedAt: '2024-06-19T18:41:45Z',
      blockReasons: [
        { id: '0', label: 'Harassment' },
        { id: '2', label: 'Spreading fake news' },
      ],
      blockedInGroups: [
        { id: 'GE', name: 'Germany' },
        { id: 'scientists', name: 'Scientists' },
      ],
      blockingModorixUserIds: ['2'],
      blockQueueModorixUserIds: [],
    });
  });

  describe('Block a X user', () => {
    it('should add X user to the block list', async () => {
      await blockXUsersService.blockXUser(getBlockXUserRequest(['1']));

      const blockedXUser = (await blockXUsersRepository.blockedXUsersList('1')).find((xUser) => xUser.xUsername === '@username');

      checkExpectedXUser(blockedXUser, [
        {
          id: '1',
          label: 'Racism / Xenophobia',
        },
      ]);
    });

    it('should add the blocked X user too all groups', async () => {
      await blockXUsersService.blockXUser(getBlockXUserRequest(['1']));

      const groupsBlockedXUserIds = (await groupsRepository.groupsList()).flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@username');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add X user to the block list with multiple reasons', async () => {
      await blockXUsersService.blockXUser(getBlockXUserRequest(['1', '3', '6']));

      const blockedXUser = (await blockXUsersRepository.blockedXUsersList('1')).find((user) => user.xUsername === '@username');

      checkExpectedXUser(blockedXUser, [
        {
          id: '1',
          label: 'Racism / Xenophobia',
        },
        {
          id: '3',
          label: 'Homophobia / Transphobia',
        },
        {
          id: '6',
          label: 'Scamming',
        },
      ]);
    });

    it('should not add X user to the block list if no reasons', async () => {
      await expect(async () => {
        await blockXUsersService.blockXUser(getBlockXUserRequest([]));
      }).rejects.toThrow(new BlockReasonError('@username', 'empty'));
    });

    it('should not add X user to the block list if at least one reason does not exist', async () => {
      await expect(async () => {
        await blockXUsersService.blockXUser(getBlockXUserRequest(['1', 'non existing reason']));
      }).rejects.toThrow(new BlockReasonError('@username', 'notFound'));
    });
  });

  describe('Block a X user from the queue', () => {
    it('should add X user to the block list', async () => {
      await blockXUsersService.addToBlockQueue('862285194', '1');

      await blockXUsersService.blockXUserFromQueue('862285194', '1');

      const blockedXUser = await blockXUsersRepository.blockedXUsersByXId('862285194');
      expect(blockedXUser).toEqual(expect.objectContaining({ blockingModorixUserIds: ['2', '1'], blockQueueModorixUserIds: [] }));
    });

    it('should not block a X user if he does not exist', async () => {
      await expect(async () => {
        await blockXUsersService.blockXUserFromQueue('1', '1');
      }).rejects.toThrow(new XUserNotFoundError('1'));
    });

    it("should not block a X user if he is not in Modorix user's block queue", async () => {
      await blockXUsersRepository.blockXUser({
        xId: '2',
        xUsername: '@userNotInModorixUserQueue',
        blockedAt: '2024-06-19T18:41:45Z',
        blockReasons: [
          { id: '0', label: 'Harassment' },
          { id: '2', label: 'Spreading fake news' },
        ],
        blockedInGroups: [
          { id: 'GE', name: 'Germany' },
          { id: 'scientists', name: 'Scientists' },
        ],
        blockingModorixUserIds: ['2'],
        blockQueueModorixUserIds: [],
      });

      await expect(async () => {
        await blockXUsersService.blockXUserFromQueue('2', '1');
      }).rejects.toThrow(new XUserNotInQueueError('2'));
    });
  });

  describe('Retrieve X users block queue candidates', () => {
    beforeEach(async () => {
      await blockXUsersRepository.blockXUser({
        xId: '1',
        xUsername: '@username',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
        blockedInGroups: [{ id: 'US', name: 'United States' }],
        blockingModorixUserIds: ['1'],
        blockQueueModorixUserIds: [],
      });
    });

    it('should give a list of X users not blocked by the current Modorix user', async () => {
      const blockQueueCandidates = await blockXUsersService.blockQueueCandidates('1');

      expect(blockQueueCandidates).toEqual([
        {
          xId: '862285194',
          xUsername: '@UltraEurope',
          blockedAt: '2024-06-19T18:41:45Z',
          blockReasons: [
            { id: '0', label: 'Harassment' },
            { id: '2', label: 'Spreading fake news' },
          ],
          blockedInGroups: [
            { id: 'GE', name: 'Germany' },
            { id: 'scientists', name: 'Scientists' },
          ],
          blockingModorixUserIds: ['2'],
          blockQueueModorixUserIds: [],
        },
      ]);
    });

    it('should not list X users in current Modorix user block queue', async () => {
      const userInBlockQueue = {
        xId: '862285194',
        xUsername: '@UltraEurope',
        blockedAt: '2024-06-19T18:41:45Z',
        blockReasons: [
          { id: '0', label: 'Harassment' },
          { id: '2', label: 'Spreading fake news' },
        ],
        blockedInGroups: [
          { id: 'GE', name: 'Germany' },
          { id: 'scientists', name: 'Scientists' },
        ],
        blockingModorixUserIds: ['2'],
        blockQueueModorixUserIds: ['1'],
      };
      await blockXUsersRepository.updateXUser(userInBlockQueue);
      const blockQueueCandidates = await blockXUsersService.blockQueueCandidates('1');

      expect(blockQueueCandidates).toEqual([]);
    });
  });

  describe('Retrieve X users block queue', () => {
    const userInBlockQueue = {
      xId: '862285194',
      xUsername: '@UltraEurope',
      blockedAt: '2024-06-19T18:41:45Z',
      blockReasons: [
        { id: '0', label: 'Harassment' },
        { id: '2', label: 'Spreading fake news' },
      ],
      blockedInGroups: [
        { id: 'GE', name: 'Germany' },
        { id: 'scientists', name: 'Scientists' },
      ],
      blockingModorixUserIds: ['2'],
      blockQueueModorixUserIds: ['1'],
    };

    beforeEach(async () => {
      await blockXUsersRepository.blockXUser({
        xId: '1',
        xUsername: '@username',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
        blockedInGroups: [{ id: 'US', name: 'United States' }],
        blockingModorixUserIds: ['1'],
        blockQueueModorixUserIds: [],
      });

      blockXUsersRepository.updateXUser(userInBlockQueue);
    });

    it('should give a list of X users not blocked by the current Modorix user', async () => {
      const blockQueue = await blockXUsersService.blockQueue('1');

      expect(blockQueue).toEqual([userInBlockQueue]);
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add X user to Modorix user block queue', async () => {
      await blockXUsersService.addToBlockQueue('862285194', 'modorix-user-id');

      const blockedXUser = (await blockXUsersRepository.blockedXUsersByIds(['862285194']))[0];

      expect(blockedXUser).toEqual({
        xId: '862285194',
        xUsername: '@UltraEurope',
        blockedAt: '2024-06-19T18:41:45Z',
        blockReasons: [
          { id: '0', label: 'Harassment' },
          { id: '2', label: 'Spreading fake news' },
        ],
        blockedInGroups: [
          { id: 'GE', name: 'Germany' },
          { id: 'scientists', name: 'Scientists' },
        ],
        blockingModorixUserIds: ['2'],
        blockQueueModorixUserIds: ['modorix-user-id'],
      });
    });

    it("should not add X user to block queue if he hasn't been blocked by any Modorix user", async () => {
      await expect(async () => {
        await blockXUsersService.addToBlockQueue('0', 'modorix-user-id');
      }).rejects.toThrow(new XUserNotFoundError('0'));
    });
  });
});
