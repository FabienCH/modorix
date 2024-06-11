import { Test, TestingModule } from '@nestjs/testing';
import { BlockReasonsRepository } from '../infrastructure/block-reason.repository';
import { BlockUsersRepository } from '../infrastructure/block-user.repository';
import { GroupsRepository } from '../infrastructure/groups.repository';
import { BlockUsersService } from './block-user.service';
import { BlockReasonError } from './errors/block-reason-error';

describe('BlockUsersService', () => {
  let blockUsersService: BlockUsersService;
  let blockUsersRepository: BlockUsersRepository;
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [BlockUsersService, BlockUsersRepository, GroupsRepository, BlockReasonsRepository],
    }).compile();

    blockUsersService = app.get<BlockUsersService>(BlockUsersService);
    blockUsersRepository = app.get<BlockUsersRepository>(BlockUsersRepository);
    groupsRepository = app.get<GroupsRepository>(GroupsRepository);
  });

  describe('block a user', () => {
    it('should add user to the block list', () => {
      blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });

      const blockedUser = blockUsersRepository.blockedUsersList().find((user) => user.id === '@userId');

      expect(blockedUser).toEqual({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });
    });

    it('should add the blocked user too all groups', () => {
      blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1'] });

      const groupsBlockedXUserIds = groupsRepository.groupsList().flatMap((group) => group.blockedXUserIds);
      const expectedIds = groupsBlockedXUserIds.map(() => '@userId');

      expect(groupsBlockedXUserIds).toEqual(expectedIds);
    });

    it('should add user to the block list with multiple reasons', () => {
      blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1', '3', '6'] });

      const blockedUser = blockUsersService.blockedUsersList().find((user) => user.id === '@userId');

      expect(blockedUser).toEqual({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1', '3', '6'] });
    });

    it('should not add user to the block list if no reasons', () => {
      expect(() => {
        blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: [] });
      }).toThrow(new BlockReasonError('@userId', 'empty'));
    });

    it('should not add user to the block list if at least one reason does not exist', () => {
      expect(() => {
        blockUsersService.blockUser({ id: '@userId', blockedAt: '2024-05-27T18:01:45Z', blockReasonIds: ['1', 'non existing reason'] });
      }).toThrow(new BlockReasonError('@userId', 'notFound'));
    });
  });
});
