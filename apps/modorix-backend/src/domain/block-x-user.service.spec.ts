import { BlockReason } from '@modorix-commons/models/block-reason';
import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockReasonsRepository } from '../infrastructure/repositories/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/repositories/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/repositories/groups.repository';
import { BlockXUsersService } from './block-x-user.service';
import { BlockReasonError } from './errors/block-reason-error';
import { XUserNotFoundError } from './errors/x-user-not-found-error';
import { XUserNotInQueueError } from './errors/x-user-not-in-queue';

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
  let blockXUsersRepository: BlockXUsersRepository;
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [BlockXUsersService, BlockXUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockXUsersService = app.get<BlockXUsersService>(BlockXUsersService);
    blockXUsersRepository = app.get<BlockXUsersRepository>(BlockXUsersRepository);
    groupsRepository = app.get<GroupsRepository>(GroupsRepository);

    blockXUsersRepository.blockXUser({
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
    it('should add X user to the block list', () => {
      blockXUsersService.blockXUser(getBlockXUserRequest(['1']));

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((xUser) => xUser.xUsername === '@username');

      checkExpectedXUser(blockedXUser, [
        {
          id: '1',
          label: 'Racism / Xenophobia',
        },
      ]);
    });

    it('should add the blocked X user too all groups', () => {
      blockXUsersService.blockXUser(getBlockXUserRequest(['1']));

      const groupsBlockedXUserIds = groupsRepository.groupsList().flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@username');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add X user to the block list with multiple reasons', () => {
      blockXUsersService.blockXUser(getBlockXUserRequest(['1', '3', '6']));

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((user) => user.xUsername === '@username');

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

    it('should not add X user to the block list if no reasons', () => {
      expect(() => {
        blockXUsersService.blockXUser(getBlockXUserRequest([]));
      }).toThrow(new BlockReasonError('@username', 'empty'));
    });

    it('should not add X user to the block list if at least one reason does not exist', () => {
      expect(() => {
        blockXUsersService.blockXUser(getBlockXUserRequest(['1', 'non existing reason']));
      }).toThrow(new BlockReasonError('@username', 'notFound'));
    });
  });

  describe('Block a X user from the queue', () => {
    it('should add X user to the block list', () => {
      blockXUsersService.addToBlockQueue('862285194', '1');

      blockXUsersService.blockXUserFromQueue('862285194', '1');

      const blockedXUser = blockXUsersRepository.blockedXUsersById('862285194');
      expect(blockedXUser).toEqual(expect.objectContaining({ blockingModorixUserIds: ['2', '1'], blockQueueModorixUserIds: [] }));
    });

    it('should not block a X user if he does not exist', () => {
      expect(() => {
        blockXUsersService.blockXUserFromQueue('1', '1');
      }).toThrow(new XUserNotFoundError('1'));
    });

    it("should not block a X user if he is not in Modorix user's block queue", () => {
      blockXUsersRepository.blockXUser({
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

      expect(() => {
        blockXUsersService.blockXUserFromQueue('2', '1');
      }).toThrow(new XUserNotInQueueError('2'));
    });
  });

  describe('Retrieve X users block queue candidates', () => {
    beforeEach(() => {
      blockXUsersRepository.blockXUser({
        xId: '1',
        xUsername: '@username',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
        blockedInGroups: [{ id: 'US', name: 'United States' }],
        blockingModorixUserIds: ['1'],
        blockQueueModorixUserIds: [],
      });
    });

    it('should give a list of X users not blocked by the current Modorix user', () => {
      const blockQueueCandidates = blockXUsersService.blockQueueCandidates('1');

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

    it('should not list X users in current Modorix user block queue', () => {
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
      blockXUsersRepository.updateXUser(userInBlockQueue);
      const blockQueueCandidates = blockXUsersService.blockQueueCandidates('1');

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

    beforeEach(() => {
      blockXUsersRepository.blockXUser({
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

    it('should give a list of X users not blocked by the current Modorix user', () => {
      const blockQueue = blockXUsersService.blockQueue('1');

      expect(blockQueue).toEqual([userInBlockQueue]);
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add X user to Modorix user block queue', () => {
      blockXUsersService.addToBlockQueue('862285194', 'modorix-user-id');

      const blockedXUser = blockXUsersRepository.blockedXUsersByIds(['862285194'])[0];

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

    it("should not add X user to block queue if he hasn't been blocked by any Modorix user", () => {
      expect(() => {
        blockXUsersService.addToBlockQueue('0', 'modorix-user-id');
      }).toThrow(new XUserNotFoundError('0'));
    });
  });
});
