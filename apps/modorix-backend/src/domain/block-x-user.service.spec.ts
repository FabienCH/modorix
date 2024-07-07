import { BlockReason } from '@modorix-commons/models/block-reason';
import { BlockXUserRequest, XUser } from '@modorix-commons/models/x-user';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockXUsersService } from './block-x-user.service';
import { BlockReasonError } from './errors/block-reason-error';
import { XUserNotFoundError } from './errors/x-user-not-found-error';

describe('BlockXUsersService', () => {
  function getBlockXUserRequest(blockReasonIds: string[], blockedInGroupsIds = ['0']): BlockXUserRequest {
    return {
      id: '@userId',
      blockedAt: '2024-05-27T18:01:45Z',
      blockReasonIds,
      blockedInGroupsIds,
      blockingModorixUserId: '1',
    };
  }
  function checkExpectedXUser(blockedXUser: XUser | undefined, blockReasons: BlockReason[]) {
    expect(blockedXUser).toEqual({
      id: '@userId',
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
      id: '@UltraEurope',
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

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((xUser) => xUser.id === '@userId');

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
      const expectedIds = groupsBlockedXUserIds.map(() => '@userId');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add X user to the block list with multiple reasons', () => {
      blockXUsersService.blockXUser(getBlockXUserRequest(['1', '3', '6']));

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((user) => user.id === '@userId');

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
      }).toThrow(new BlockReasonError('@userId', 'empty'));
    });

    it('should not add X user to the block list if at least one reason does not exist', () => {
      expect(() => {
        blockXUsersService.blockXUser(getBlockXUserRequest(['1', 'non existing reason']));
      }).toThrow(new BlockReasonError('@userId', 'notFound'));
    });
  });

  describe('Retrieve X users block queue candidates', () => {
    beforeEach(() => {
      blockXUsersRepository.blockXUser({
        id: '@userId',
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
          id: '@UltraEurope',
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
      const userInBLockQueue = {
        id: '@UltraEurope',
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
      blockXUsersRepository.updateXUser(userInBLockQueue);
      const blockQueueCandidates = blockXUsersService.blockQueueCandidates('1');

      expect(blockQueueCandidates).toEqual([]);
    });
  });

  describe('Add a X user to block queue', () => {
    it('should add X user to Modorix user block queue', () => {
      blockXUsersService.addToBlockQueue('@UltraEurope', 'modorix-user-id');

      const blockedXUser = blockXUsersRepository.blockedXUsersByIds(['@UltraEurope'])[0];

      expect(blockedXUser).toEqual({
        id: '@UltraEurope',
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
        blockXUsersService.addToBlockQueue('@not-blocked-x-user', 'modorix-user-id');
      }).toThrow(new XUserNotFoundError('@not-blocked-x-user'));
    });
  });
});
