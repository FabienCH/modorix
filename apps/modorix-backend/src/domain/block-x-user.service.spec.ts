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

  describe('block a X user', () => {
    it('should add X user to the block list', () => {
      blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });

      const blockedXUser = blockXUsersRepository.blockedXUsersList().find((xUser) => xUser.id === '@userId');

      expect(blockedXUser).toEqual({
        id: '@userId',
        blockedAt: '2024-05-27T18:01:45Z',
        blockReasons: [
          {
            id: '1',
            label: 'Racism / Xenophobia',
          },
        ],
      });
    });

    it('should add the blocked X user too all groups', () => {
      blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });

      const groupsBlockedXUserIds = groupsRepository.groupsList().flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@userId');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add X user to the block list with multiple reasons', () => {
      blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1', '3', '6'] });

      const blockedXUser = blockXUsersRepository.blockedXUsersList().find((user) => user.id === '@userId');

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
      });
    });

    it('should not add X user to the block list if no reasons', () => {
      expect(() => {
        blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: [] });
      }).toThrow(new BlockReasonError('@userId', 'empty'));
    });

    it('should not add X user to the block list if at least one reason does not exist', () => {
      expect(() => {
        blockXUsersService.blockXUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1', 'non existing reason'] });
      }).toThrow(new BlockReasonError('@userId', 'notFound'));
    });
  });
});
