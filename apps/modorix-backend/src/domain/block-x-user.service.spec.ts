import { Test, TestingModule } from '@nestjs/testing';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockXUsersRepository } from '../infrastructure/block-x-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockXUsersService } from './block-x-user.service';
import { BlockReasonError } from './errors/block-reason-error';

describe('BlockXUsersService', () => {
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
  });

  describe('Block a X user', () => {
    it('should add X user to the block list', () => {
      blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'], blockingUserId: '1' });

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((xUser) => xUser.id === '@userId');

      expect(blockedXUser).toEqual({
        id: '@userId',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [
          {
            id: '1',
            label: 'Racism / Xenophobia',
          },
        ],
        blockingUserIds: ['1'],
      });
    });

    it('should add the blocked X user too all groups', () => {
      blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'], blockingUserId: '1' });

      const groupsBlockedXUserIds = groupsRepository.groupsList().flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@userId');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add X user to the block list with multiple reasons', () => {
      blockXUsersService.blockXUser({
        id: '@userId',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasonIds: ['1', '3', '6'],
        blockingUserId: '1',
      });

      const blockedXUser = blockXUsersRepository.blockedXUsersList('1').find((user) => user.id === '@userId');

      expect(blockedXUser).toEqual({
        id: '@userId',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [
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
        ],
        blockingUserIds: ['1'],
      });
    });

    it('should not add X user to the block list if no reasons', () => {
      expect(() => {
        blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: [], blockingUserId: '1' });
      }).toThrow(new BlockReasonError('@userId', 'empty'));
    });

    it('should not add X user to the block list if at least one reason does not exist', () => {
      expect(() => {
        blockXUsersService.blockXUser({
          id: '@userId',
          blockedAt: '2024-05-27T18:01:45Z',
          blockReasonIds: ['1', 'non existing reason'],
          blockingUserId: '1',
        });
      }).toThrow(new BlockReasonError('@userId', 'notFound'));
    });
  });

  describe('Retrieve X users block queue candidates', () => {
    beforeEach(() => {
      blockXUsersRepository.blockXUser({
        id: '@userId',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [{ id: '1', label: 'Racism / Xenophobia' }],
        blockingUserIds: ['1'],
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
          blockingUserIds: ['2'],
        },
      ]);
    });
  });
});
